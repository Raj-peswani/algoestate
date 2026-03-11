import { useEffect, useMemo, useState } from "react";
import {
  fetchTransactionFilterOptions,
  fetchTransactions,
} from "../api/transactions";

const DEFAULTS = {
  city: "",
  assetType: "",
  transactionType: "",
  dateFrom: "",
  dateTo: "",
  sortBy: "transaction_date",
  sortOrder: "desc",
  page: 1,
  pageSize: 20,
};

export function useTransactions(params = {}) {
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
      options.city,
      options.assetType,
      options.transactionType,
      options.dateFrom,
      options.dateTo,
      options.sortBy,
      options.sortOrder,
      options.page,
      options.pageSize,
    ]
  );

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchTransactions(options);
        if (!mounted) return;
        setData(result.data);
        setTotalCount(result.totalCount);
      } catch (err) {
        if (!mounted) return;
        setError(err.message || "Failed to load transactions");
        setData([]);
        setTotalCount(0);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
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

export function useTransactionFilterOptions() {
  const [cities, setCities] = useState([]);
  const [assetTypes, setAssetTypes] = useState([]);
  const [transactionTypes, setTransactionTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchTransactionFilterOptions();
        if (!mounted) return;
        setCities(result.cities);
        setAssetTypes(result.assetTypes);
        setTransactionTypes(result.transactionTypes);
      } catch (err) {
        if (!mounted) return;
        setError(err.message || "Failed to load transaction filter options");
        setCities([]);
        setAssetTypes([]);
        setTransactionTypes([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  return { cities, assetTypes, transactionTypes, loading, error };
}
