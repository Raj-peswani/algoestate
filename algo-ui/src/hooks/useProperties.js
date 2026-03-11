import { useEffect, useMemo, useState } from "react";
import { supabase, supabaseConfigError } from "../lib/supabase";

const DEFAULTS = {
  searchTerm: "",
  city: "",
  microMarket: "",
  assetType: "",
  verifiedOnly: false,
  minArea: "",
  maxArea: "",
  sortBy: "created_at",
  sortOrder: "desc",
  page: 1,
  pageSize: 20,
};

const ALLOWED_SORT_COLUMNS = new Set([
  "created_at",
  "title",
  "city",
  "builtup_area_sqft",
  "confidence_overall",
]);

export function useProperties(params = {}) {
  const options = { ...DEFAULTS, ...params };
  const [data, setData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const queryKey = useMemo(
    () =>
      JSON.stringify({
        ...options,
        page: Number(options.page) || 1,
        pageSize: Number(options.pageSize) || 20,
      }),
    [
      options.searchTerm,
      options.city,
      options.microMarket,
      options.assetType,
      options.verifiedOnly,
      options.minArea,
      options.maxArea,
      options.sortBy,
      options.sortOrder,
      options.page,
      options.pageSize,
    ]
  );

  useEffect(() => {
    let isMounted = true;

    async function loadProperties() {
      setLoading(true);
      setError(null);
      if (!supabase) {
        setError(supabaseConfigError || "Supabase is not configured.");
        setData([]);
        setTotalCount(0);
        setLoading(false);
        return;
      }

      const page = Math.max(1, Number(options.page) || 1);
      const pageSize = Math.max(1, Number(options.pageSize) || 20);
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      let query = supabase
        .from("properties")
        .select(
          "id, ae_property_id, title, city, micro_market, locality, builtup_area_sqft, asset_type, verified, confidence_overall, created_at",
          { count: "exact" }
        );

      const trimmedSearch = String(options.searchTerm || "").trim();
      if (trimmedSearch) {
        const safeSearch = trimmedSearch
          .replace(/,/g, " ")
          .replace(/'/g, "''")
          .replace(/\s+/g, " ");
        query = query.or(
          `title.ilike.%${safeSearch}%,city.ilike.%${safeSearch}%,micro_market.ilike.%${safeSearch}%,locality.ilike.%${safeSearch}%`
        );
      }

      if (options.city) query = query.eq("city", options.city);
      if (options.microMarket) query = query.ilike("micro_market", `%${options.microMarket}%`);
      if (options.assetType) query = query.eq("asset_type", options.assetType);
      if (options.verifiedOnly) query = query.eq("verified", true);
      const parsedMinArea = Number(options.minArea);
      if (options.minArea !== "" && options.minArea !== null && Number.isFinite(parsedMinArea)) {
        query = query.gte("builtup_area_sqft", parsedMinArea);
      }
      const parsedMaxArea = Number(options.maxArea);
      if (options.maxArea !== "" && options.maxArea !== null && Number.isFinite(parsedMaxArea)) {
        query = query.lte("builtup_area_sqft", parsedMaxArea);
      }

      const sortColumn = ALLOWED_SORT_COLUMNS.has(options.sortBy)
        ? options.sortBy
        : "created_at";
      const ascending = options.sortOrder === "asc";

      const { data: rows, error: queryError, count } = await query
        .order(sortColumn, { ascending, nullsFirst: false })
        .range(from, to);

      if (!isMounted) return;

      if (queryError) {
        setError(queryError.message || "Failed to load properties");
        setData([]);
        setTotalCount(0);
      } else {
        const normalized = (rows || []).map((row) => ({
          id: row.id,
          ae_property_id: row.ae_property_id,
          title: row.title || "-",
          city: row.city || "-",
          micro_market: row.micro_market || "-",
          locality: row.locality || "-",
          asset_type: row.asset_type || "-",
          verified: Boolean(row.verified),
          confidence_overall:
            row.confidence_overall === null || row.confidence_overall === undefined
              ? null
              : Number(row.confidence_overall),
          area_sqft:
            row.builtup_area_sqft === null || row.builtup_area_sqft === undefined
              ? null
              : Number(row.builtup_area_sqft),
        }));
        setData(normalized);
        setTotalCount(count || 0);
      }

      setLoading(false);
    }

    loadProperties();

    return () => {
      isMounted = false;
    };
  }, [queryKey, refreshKey]);

  return {
    loading,
    error,
    data,
    totalCount,
    refresh: () => setRefreshKey((k) => k + 1),
  };
}
