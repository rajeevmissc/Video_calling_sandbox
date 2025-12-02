// hooks/useProviders.js
import { useState, useEffect } from 'react';
import { getAllProviders } from '../data/serviceData';

export const useProviders = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchProviders = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await getAllProviders();
        if (isMounted) {
          setProviders(data || []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
          console.error("Error fetching providers:", err);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProviders();
    return () => { isMounted = false };
  }, []);

  return { providers, loading, error };
};