import { supabase, supabaseConfigError } from "../lib/supabase";

const ALLOWED_SORT_COLUMNS = new Set([
  "transaction_date",
  "transaction_type",
  "buyer_name",
  "seller_name",
  "transacted_area_sqft",
  "transacted_price_inr",
  "rent_inr_sqft_mo",
  "cap_rate",
  "verified",
  "confidence_overall",
  "city",
  "asset_type",
  "created_at",
]);

export async function fetchTransactionFilterOptions() {
  if (!supabase) {
    throw new Error(supabaseConfigError || "Supabase is not configured.");
  }
  const { data, error } = await supabase
    .from("transactions")
    .select("city, asset_type, transaction_type")
    .limit(5000);

  if (error) throw new Error(error.message || "Failed to load transaction filter options");

  const citySet = new Set();
  const assetTypeSet = new Set();
  const transactionTypeSet = new Set();

  (data || []).forEach((row) => {
    if (row.city) citySet.add(String(row.city).trim());
    if (row.asset_type) assetTypeSet.add(String(row.asset_type).trim().toLowerCase());
    if (row.transaction_type) {
      transactionTypeSet.add(String(row.transaction_type).trim().toLowerCase());
    }
  });

  return {
    cities: [...citySet].sort((a, b) => a.localeCompare(b)),
    assetTypes: [...assetTypeSet].sort((a, b) => a.localeCompare(b)),
    transactionTypes: [...transactionTypeSet].sort((a, b) => a.localeCompare(b)),
  };
}

export async function fetchTransactions(params = {}) {
  if (!supabase) {
    throw new Error(supabaseConfigError || "Supabase is not configured.");
  }
  const {
    city = "",
    assetType = "",
    transactionType = "",
    dateFrom = "",
    dateTo = "",
    sortBy = "transaction_date",
    sortOrder = "desc",
    page = 1,
    pageSize = 20,
  } = params;

  const safePage = Math.max(1, Number(page) || 1);
  const safePageSize = Math.max(1, Number(pageSize) || 20);
  const from = (safePage - 1) * safePageSize;
  const to = from + safePageSize - 1;

  let query = supabase
    .from("transactions")
    .select(
      [
        "id",
        "transaction_date",
        "transaction_type",
        "buyer_name",
        "seller_name",
        "transacted_area_sqft",
        "transacted_price_inr",
        "rent_inr_sqft_mo",
        "cap_rate",
        "verified",
        "confidence_overall",
        "city",
        "asset_type",
      ].join(", "),
      { count: "exact" }
    );

  if (city) query = query.eq("city", city);
  if (assetType) query = query.eq("asset_type", assetType);
  if (transactionType) query = query.eq("transaction_type", transactionType);
  if (dateFrom) query = query.gte("transaction_date", dateFrom);
  if (dateTo) query = query.lte("transaction_date", dateTo);

  const safeSortColumn = ALLOWED_SORT_COLUMNS.has(sortBy) ? sortBy : "transaction_date";
  const ascending = sortOrder === "asc";

  const { data, error, count } = await query
    .order(safeSortColumn, { ascending, nullsFirst: false })
    .range(from, to);

  if (error) throw new Error(error.message || "Failed to load transactions");

  return {
    data: data || [],
    totalCount: count || 0,
  };
}
