import { useState, useEffect } from "react";
import { getFullProviderData } from "../data/serviceData";

export const useProviderById = (providerId) => {
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!providerId) return;

    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getFullProviderData(providerId);
        if (isMounted) setProvider(data);
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Error fetching provider");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();
    return () => { isMounted = false };
  }, [providerId]);
  console.log('provider ......................', provider);
  return { provider, loading, error };
};
