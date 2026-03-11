export default function TransactionsFilters({
  filters,
  cityOptions,
  assetTypeOptions,
  transactionTypeOptions,
  onChange,
  onClear,
}) {
  const update = (key, value) => onChange({ ...filters, [key]: value });

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            City
          </label>
          <select
            value={filters.city}
            onChange={(e) => update("city", e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-slate-500"
          >
            <option value="">All Cities</option>
            {cityOptions.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Asset Type
          </label>
          <select
            value={filters.assetType}
            onChange={(e) => update("assetType", e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-slate-500"
          >
            <option value="">All Types</option>
            {assetTypeOptions.map((assetType) => (
              <option key={assetType} value={assetType}>
                {assetType}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Transaction Type
          </label>
          <select
            value={filters.transactionType}
            onChange={(e) => update("transactionType", e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-slate-500"
          >
            <option value="">All Transactions</option>
            {transactionTypeOptions.map((transactionType) => (
              <option key={transactionType} value={transactionType}>
                {transactionType}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Date From
          </label>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => update("dateFrom", e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-slate-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Date To
          </label>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => update("dateTo", e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-slate-500"
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-3">
        <div className="flex flex-wrap items-center gap-2">
          <label className="text-sm text-slate-600">Sort By</label>
          <select
            value={filters.sortBy}
            onChange={(e) => update("sortBy", e.target.value)}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="transaction_date">Date</option>
            <option value="transacted_area_sqft">Area</option>
            <option value="transacted_price_inr">Price</option>
            <option value="rent_inr_sqft_mo">Rent</option>
            <option value="cap_rate">Cap Rate</option>
            <option value="confidence_overall">Confidence</option>
          </select>
          <button
            type="button"
            onClick={() =>
              update("sortOrder", filters.sortOrder === "asc" ? "desc" : "asc")
            }
            className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            {filters.sortOrder === "asc" ? "Ascending" : "Descending"}
          </button>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
}
