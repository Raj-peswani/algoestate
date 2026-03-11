function formatNumber(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "-";
  return Number(value).toLocaleString("en-IN");
}

export default function PropertyStats({ data, totalCount }) {
  const verifiedCount = data.filter((item) => item.verified).length;
  const numericAreas = data
    .map((item) => item.area_sqft)
    .filter((value) => value !== null && !Number.isNaN(Number(value)));
  const avgArea =
    numericAreas.length > 0
      ? Math.round(numericAreas.reduce((sum, val) => sum + Number(val), 0) / numericAreas.length)
      : null;

  const numericConfidence = data
    .map((item) => item.confidence_overall)
    .filter((value) => value !== null && !Number.isNaN(Number(value)));
  const avgConfidence =
    numericConfidence.length > 0
      ? Math.round(
          (numericConfidence.reduce((sum, val) => sum + Number(val), 0) /
            numericConfidence.length) *
            10
        ) / 10
      : null;

  const cards = [
    { label: "Total Properties", value: formatNumber(totalCount) },
    { label: "Verified Properties", value: formatNumber(verifiedCount) },
    { label: "Average Area (sqft)", value: formatNumber(avgArea) },
    {
      label: "Average Confidence",
      value: avgConfidence === null ? "-" : `${avgConfidence}%`,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
        >
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {card.label}
          </div>
          <div className="mt-2 text-2xl font-semibold text-slate-900">{card.value}</div>
        </div>
      ))}
    </div>
  );
}
