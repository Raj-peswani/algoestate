import { supabase } from "../lib/supabase";

export async function fetchPropertyFilterOptions() {
  const { data, error } = await supabase
    .from("properties")
    .select("city, asset_type")
    .limit(5000);

  if (error) throw new Error(error.message || "Failed to load property filter options");

  const citySet = new Set();
  const assetTypeSet = new Set();

  (data || []).forEach((row) => {
    if (row.city) citySet.add(String(row.city).trim());
    if (row.asset_type) assetTypeSet.add(String(row.asset_type).trim().toLowerCase());
  });

  return {
    cities: [...citySet].sort((a, b) => a.localeCompare(b)),
    assetTypes: [...assetTypeSet].sort((a, b) => a.localeCompare(b)),
  };
}
