import { useEffect, useMemo, useState } from "react";
import PropertyFilters from "../components/PropertyFilters";
import PropertyStats from "../components/PropertyStats";
import PropertyTable from "../components/PropertyTable";
import { useProperties } from "../hooks/useProperties";
import { usePropertyFilterOptions } from "../hooks/usePropertyFilterOptions";
import {
  useTransactionFilterOptions,
  useTransactions,
} from "../hooks/useTransactions";
import TransactionsFilters from "../components/TransactionsFilters";
import TransactionsTable from "../components/TransactionsTable";

const DEFAULT_FILTERS = {
  searchTerm: "",
  city: "",
  microMarket: "",
  assetType: "",
  verifiedOnly: false,
  minArea: "",
  maxArea: "",
  sortBy: "created_at",
  sortOrder: "desc",
};

const DEFAULT_TRANSACTION_FILTERS = {
  city: "",
  assetType: "",
  transactionType: "",
  dateFrom: "",
  dateTo: "",
  sortBy: "transaction_date",
  sortOrder: "desc",
};

const UI_TO_DB_SORT = {
  area_sqft: "builtup_area_sqft",
  confidence_overall: "confidence_overall",
  title: "title",
  city: "city",
  created_at: "created_at",
};

function parseInitialState() {
  const params = new URLSearchParams(window.location.search);
  return {
    filters: {
      ...DEFAULT_FILTERS,
      searchTerm: params.get("search") || "",
      city: params.get("city") || "",
      microMarket: params.get("microMarket") || "",
      assetType: params.get("assetType") || "",
      verifiedOnly: params.get("verifiedOnly") === "true",
      minArea: params.get("minArea") || "",
      maxArea: params.get("maxArea") || "",
      sortBy: params.get("sortBy") || "created_at",
      sortOrder: params.get("sortOrder") || "desc",
    },
    page: Math.max(1, Number(params.get("page")) || 1),
    pageSize: [10, 20, 50].includes(Number(params.get("pageSize")))
      ? Number(params.get("pageSize"))
      : 20,
  };
}

export default function PropertyIntelligencePage() {
  const [state] = useState(() => parseInitialState());
  const [filters, setFilters] = useState(state.filters);
  const [page, setPage] = useState(state.page);
  const [pageSize, setPageSize] = useState(state.pageSize);
  const [debouncedSearch, setDebouncedSearch] = useState(state.filters.searchTerm);
  const [transactionFilters, setTransactionFilters] = useState(
    DEFAULT_TRANSACTION_FILTERS
  );
  const [transactionPage, setTransactionPage] = useState(1);
  const [transactionPageSize, setTransactionPageSize] = useState(20);

  const {
    cities: propertyCities,
    assetTypes: propertyAssetTypes,
  } = usePropertyFilterOptions();
  const {
    cities: transactionCities,
    assetTypes: transactionAssetTypes,
    transactionTypes,
  } = useTransactionFilterOptions();

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(filters.searchTerm), 300);
    return () => clearTimeout(timer);
  }, [filters.searchTerm]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.searchTerm) params.set("search", filters.searchTerm);
    if (filters.city) params.set("city", filters.city);
    if (filters.microMarket) params.set("microMarket", filters.microMarket);
    if (filters.assetType) params.set("assetType", filters.assetType);
    if (filters.verifiedOnly) params.set("verifiedOnly", "true");
    if (filters.minArea) params.set("minArea", String(filters.minArea));
    if (filters.maxArea) params.set("maxArea", String(filters.maxArea));
    params.set("sortBy", filters.sortBy);
    params.set("sortOrder", filters.sortOrder);
    params.set("page", String(page));
    params.set("pageSize", String(pageSize));
    const nextUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, "", nextUrl);
  }, [filters, page, pageSize]);

  const { loading, error, data, totalCount } = useProperties({
    searchTerm: debouncedSearch,
    city: filters.city,
    microMarket: filters.microMarket,
    assetType: filters.assetType,
    verifiedOnly: filters.verifiedOnly,
    minArea: filters.minArea,
    maxArea: filters.maxArea,
    sortBy: UI_TO_DB_SORT[filters.sortBy] || "created_at",
    sortOrder: filters.sortOrder,
    page,
    pageSize,
  });
  const {
    loading: transactionsLoading,
    error: transactionsError,
    data: transactionsData,
    totalCount: transactionsTotalCount,
  } = useTransactions({
    city: transactionFilters.city,
    assetType: transactionFilters.assetType,
    transactionType: transactionFilters.transactionType,
    dateFrom: transactionFilters.dateFrom,
    dateTo: transactionFilters.dateTo,
    sortBy: transactionFilters.sortBy,
    sortOrder: transactionFilters.sortOrder,
    page: transactionPage,
    pageSize: transactionPageSize,
  });

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const fromRecord = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const toRecord = totalCount === 0 ? 0 : Math.min(page * pageSize, totalCount);

  const cityOptions = useMemo(() => {
    const s = new Set(propertyCities);
    if (filters.city) s.add(filters.city);
    return [...s].sort((a, b) => a.localeCompare(b));
  }, [propertyCities, filters.city]);

  const assetTypeOptions = useMemo(() => {
    const s = new Set(propertyAssetTypes);
    if (filters.assetType) s.add(filters.assetType);
    return [...s].sort((a, b) => a.localeCompare(b));
  }, [propertyAssetTypes, filters.assetType]);

  const handleFiltersChange = (nextFilters) => {
    setFilters(nextFilters);
    setPage(1);
  };

  const handleClear = () => {
    setFilters(DEFAULT_FILTERS);
    setDebouncedSearch("");
    setPage(1);
    setPageSize(20);
  };

  const handleSortChange = (column, order) => {
    setFilters((prev) => ({ ...prev, sortBy: column, sortOrder: order }));
    setPage(1);
  };

  const transactionTotalPages = Math.max(
    1,
    Math.ceil(transactionsTotalCount / transactionPageSize)
  );
  const transactionFromRecord =
    transactionsTotalCount === 0 ? 0 : (transactionPage - 1) * transactionPageSize + 1;
  const transactionToRecord =
    transactionsTotalCount === 0
      ? 0
      : Math.min(transactionPage * transactionPageSize, transactionsTotalCount);

  const handleTransactionFiltersChange = (nextFilters) => {
    setTransactionFilters(nextFilters);
    setTransactionPage(1);
  };

  const handleTransactionSortChange = (column, order) => {
    setTransactionFilters((prev) => ({ ...prev, sortBy: column, sortOrder: order }));
    setTransactionPage(1);
  };

  const clearTransactionFilters = () => {
    setTransactionFilters(DEFAULT_TRANSACTION_FILTERS);
    setTransactionPage(1);
    setTransactionPageSize(20);
  };

  return (
    <main className="mx-auto min-h-screen max-w-[1400px] p-4 sm:p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Property Intelligence
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Discover verified CRE opportunities with confidence-led filters
          </p>
        </div>
        <div className="text-sm text-slate-600">
          Showing {fromRecord.toLocaleString("en-IN")}–{toRecord.toLocaleString("en-IN")} of{" "}
          {totalCount.toLocaleString("en-IN")} properties
        </div>
      </div>

      <div className="space-y-4">
        <PropertyFilters
          filters={filters}
          cityOptions={cityOptions}
          assetTypeOptions={assetTypeOptions}
          onChange={handleFiltersChange}
          onClear={handleClear}
        />

        <PropertyStats data={data} totalCount={totalCount} />

        <PropertyTable
          data={data}
          loading={loading}
          error={error}
          sortBy={filters.sortBy}
          sortOrder={filters.sortOrder}
          onSortChange={handleSortChange}
        />

        <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-slate-600">
            Showing {fromRecord.toLocaleString("en-IN")}–{toRecord.toLocaleString("en-IN")} of{" "}
            {totalCount.toLocaleString("en-IN")} properties
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <label className="text-sm text-slate-600">Rows</label>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              className="rounded-md border border-slate-300 px-2 py-1.5 text-sm"
            >
              {[10, 20, 50].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>
            <span className="min-w-24 text-center text-sm text-slate-700">
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>

        <section className="mt-6 space-y-4 border-t border-slate-200 pt-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-slate-900">
                Transaction Intelligence
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Explore verified transaction activity across sales and leasing
              </p>
            </div>
            <div className="text-sm text-slate-600">
              Showing {transactionFromRecord.toLocaleString("en-IN")}–
              {transactionToRecord.toLocaleString("en-IN")} of{" "}
              {transactionsTotalCount.toLocaleString("en-IN")} transactions
            </div>
          </div>

          <TransactionsFilters
            filters={transactionFilters}
            cityOptions={transactionCities}
            assetTypeOptions={transactionAssetTypes}
            transactionTypeOptions={transactionTypes}
            onChange={handleTransactionFiltersChange}
            onClear={clearTransactionFilters}
          />

          <TransactionsTable
            data={transactionsData}
            loading={transactionsLoading}
            error={transactionsError}
            sortBy={transactionFilters.sortBy}
            sortOrder={transactionFilters.sortOrder}
            onSortChange={handleTransactionSortChange}
          />

          <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-slate-600">
              Showing {transactionFromRecord.toLocaleString("en-IN")}–
              {transactionToRecord.toLocaleString("en-IN")} of{" "}
              {transactionsTotalCount.toLocaleString("en-IN")} transactions
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <label className="text-sm text-slate-600">Rows</label>
              <select
                value={transactionPageSize}
                onChange={(e) => {
                  setTransactionPageSize(Number(e.target.value));
                  setTransactionPage(1);
                }}
                className="rounded-md border border-slate-300 px-2 py-1.5 text-sm"
              >
                {[10, 20, 50].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => setTransactionPage((p) => Math.max(1, p - 1))}
                disabled={transactionPage <= 1}
                className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>
              <span className="min-w-24 text-center text-sm text-slate-700">
                Page {transactionPage} of {transactionTotalPages}
              </span>
              <button
                type="button"
                onClick={() =>
                  setTransactionPage((p) => Math.min(transactionTotalPages, p + 1))
                }
                disabled={transactionPage >= transactionTotalPages}
                className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
