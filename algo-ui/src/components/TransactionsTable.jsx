function formatNumber(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "-";
  return Number(value).toLocaleString("en-IN");
}

function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-IN");
}

function formatPercent(value) {
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

const COLUMNS = [
  { key: "transaction_date", label: "transaction_date", sortable: true },
  { key: "transaction_type", label: "transaction_type", sortable: true },
  { key: "buyer_name", label: "buyer_name", sortable: true },
  { key: "seller_name", label: "seller_name", sortable: true },
  { key: "transacted_area_sqft", label: "transacted_area_sqft", sortable: true },
  { key: "transacted_price_inr", label: "transacted_price_inr", sortable: true },
  { key: "rent_inr_sqft_mo", label: "rent_inr_sqft_mo", sortable: true },
  { key: "cap_rate", label: "cap_rate", sortable: true },
  { key: "verified", label: "verified", sortable: true },
  { key: "confidence_overall", label: "confidence_overall", sortable: true },
];

export default function TransactionsTable({
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
        Loading transactions...
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
        No transactions found for current filters.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="max-h-[520px] overflow-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="sticky top-0 z-10 bg-slate-50">
            <tr>
              {COLUMNS.map((column) => (
                <th
                  key={column.key}
                  onClick={() => {
                    if (!column.sortable) return;
                    const nextOrder =
                      sortBy === column.key && sortOrder === "asc" ? "desc" : "asc";
                    onSortChange(column.key, nextOrder);
                  }}
                  className="cursor-pointer select-none px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600"
                >
                  <SortLabel
                    label={column.label}
                    active={sortBy === column.key}
                    direction={sortOrder}
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((row, idx) => (
              <tr key={row.id ?? idx} className="hover:bg-slate-50">
                <td className="px-4 py-3 text-sm text-slate-700">
                  {formatDate(row.transaction_date)}
                </td>
                <td className="px-4 py-3 text-sm text-slate-700">{row.transaction_type || "-"}</td>
                <td className="px-4 py-3 text-sm text-slate-700">{row.buyer_name || "-"}</td>
                <td className="px-4 py-3 text-sm text-slate-700">{row.seller_name || "-"}</td>
                <td className="px-4 py-3 text-sm text-slate-700">
                  {formatNumber(row.transacted_area_sqft)}
                </td>
                <td className="px-4 py-3 text-sm text-slate-700">
                  {formatNumber(row.transacted_price_inr)}
                </td>
                <td className="px-4 py-3 text-sm text-slate-700">
                  {formatNumber(row.rent_inr_sqft_mo)}
                </td>
                <td className="px-4 py-3 text-sm text-slate-700">{formatPercent(row.cap_rate)}</td>
                <td className="px-4 py-3 text-sm">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                      row.verified
                        ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                        : "bg-slate-100 text-slate-600 ring-1 ring-slate-200"
                    }`}
                  >
                    {row.verified ? "Verified" : "Unverified"}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-slate-700">
                  {formatPercent(row.confidence_overall)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
