const SORTABLE_COLUMNS = new Set([
  "title",
  "city",
  "area_sqft",
  "confidence_overall",
]);

function formatArea(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "-";
  return Number(value).toLocaleString("en-IN");
}

function formatConfidence(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "-";
  return `${Number(value).toFixed(1)}%`;
}

function SortLabel({ label, active, direction }) {
  if (!active) return <span>{label}</span>;
  return (
    <span className="inline-flex items-center gap-1">
      {label}
      <span className="text-slate-500">{direction === "asc" ? "↑" : "↓"}</span>
    </span>
  );
}

export default function PropertyTable({
  data,
  loading,
  error,
  sortBy,
  sortOrder,
  onSortChange,
}) {
  if (loading) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-6 text-slate-600 shadow-sm">
        Loading properties...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-700 shadow-sm">
        Error: {error}
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-6 text-slate-600 shadow-sm">
        No properties found.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="max-h-[560px] overflow-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="sticky top-0 z-10 bg-slate-50">
          <tr>
            {[
              { key: "title", label: "title" },
              { key: "city", label: "city" },
            ].map((column) => (
              <th
                key={column.key}
                onClick={() => {
                  if (!SORTABLE_COLUMNS.has(column.key)) return;
                  const nextOrder =
                    sortBy === column.key && sortOrder === "asc" ? "desc" : "asc";
                  onSortChange(column.key, nextOrder);
                }}
                className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 ${
                  SORTABLE_COLUMNS.has(column.key) ? "cursor-pointer select-none" : ""
                }`}
              >
                <SortLabel
                  label={column.label}
                  active={sortBy === column.key}
                  direction={sortOrder}
                />
              </th>
            ))}
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
              micro_market
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
              asset_type
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
              <button
                type="button"
                onClick={() => {
                  const nextOrder =
                    sortBy === "area_sqft" && sortOrder === "asc" ? "desc" : "asc";
                  onSortChange("area_sqft", nextOrder);
                }}
                className="cursor-pointer select-none"
              >
                <SortLabel
                  label="area_sqft"
                  active={sortBy === "area_sqft"}
                  direction={sortOrder}
                />
              </button>
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
              verified
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
              <button
                type="button"
                onClick={() => {
                  const nextOrder =
                    sortBy === "confidence_overall" && sortOrder === "asc"
                      ? "desc"
                      : "asc";
                  onSortChange("confidence_overall", nextOrder);
                }}
                className="cursor-pointer select-none"
              >
                <SortLabel
                  label="confidence_overall"
                  active={sortBy === "confidence_overall"}
                  direction={sortOrder}
                />
              </button>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.map((property, idx) => (
            <tr key={`${property.title}-${property.city}-${idx}`} className="hover:bg-slate-50">
              <td className="px-4 py-3 text-sm text-slate-800">{property.title}</td>
              <td className="px-4 py-3 text-sm text-slate-700">{property.city}</td>
              <td className="px-4 py-3 text-sm text-slate-700">{property.micro_market}</td>
              <td className="px-4 py-3 text-sm text-slate-700">{property.asset_type}</td>
              <td className="px-4 py-3 text-sm text-slate-700">{formatArea(property.area_sqft)}</td>
              <td className="px-4 py-3 text-sm">
                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                    property.verified
                      ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                      : "bg-slate-100 text-slate-600 ring-1 ring-slate-200"
                  }`}
                >
                  {property.verified ? "Verified" : "Unverified"}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-slate-700">
                {formatConfidence(property.confidence_overall)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}
