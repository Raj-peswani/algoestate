import { useEffect, useState } from "react";
import { fetchPropertyFilterOptions } from "../api/properties";

export function usePropertyFilterOptions() {
  const [cities, setCities] = useState([]);
  const [assetTypes, setAssetTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const { cities: nextCities, assetTypes: nextAssetTypes } =
          await fetchPropertyFilterOptions();
        if (!mounted) return;
        setCities(nextCities);
        setAssetTypes(nextAssetTypes);
      } catch (err) {
        if (!mounted) return;
        setError(err.message || "Failed to load filter options");
        setCities([]);
        setAssetTypes([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  return { cities, assetTypes, loading, error };
}
