export default function PropertyFilters({
  filters,
  cityOptions,
  assetTypeOptions,
  onChange,
  onClear,
}) {
  const update = (key, value) => onChange({ ...filters, [key]: value });

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div className="xl:col-span-2">
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Search
          </label>
          <input
            type="text"
            value={filters.searchTerm}
            onChange={(e) => update("searchTerm", e.target.value)}
            placeholder="Search title, city, micro-market, locality..."
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-0 transition focus:border-slate-500"
          />
        </div>

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
            Micro-Market
          </label>
          <input
            type="text"
            value={filters.microMarket}
            onChange={(e) => update("microMarket", e.target.value)}
            placeholder="e.g. BKC, ORR"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-slate-500"
          />
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
            Min Area (sqft)
          </label>
          <input
            type="number"
            min="0"
            value={filters.minArea}
            onChange={(e) => update("minArea", e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-slate-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Max Area (sqft)
          </label>
          <input
            type="number"
            min="0"
            value={filters.maxArea}
            onChange={(e) => update("maxArea", e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-slate-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Sort By
          </label>
          <select
            value={filters.sortBy}
            onChange={(e) => update("sortBy", e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-slate-500"
          >
            <option value="created_at">Created</option>
            <option value="title">Title</option>
            <option value="city">City</option>
            <option value="area_sqft">Area</option>
            <option value="confidence_overall">Confidence</option>
          </select>
        </div>

        <div className="flex items-end gap-2">
          <button
            type="button"
            onClick={() =>
              update("sortOrder", filters.sortOrder === "asc" ? "desc" : "asc")
            }
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Sort: {filters.sortOrder === "asc" ? "Ascending" : "Descending"}
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-3">
        <label className="inline-flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={filters.verifiedOnly}
            onChange={(e) => update("verifiedOnly", e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-slate-800 focus:ring-slate-500"
          />
          Verified only
        </label>
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
