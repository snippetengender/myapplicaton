import { useState, useEffect, useRef, useCallback } from "react";
import api from "../providers/api";

export const useNetworks = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [networks, setNetworks] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setPage(1);
      setHasMore(true);
      // 🔑 DO NOT clear networks here on mount
    }, 500);

    return () => clearTimeout(timerId);
  }, [searchTerm]);

  useEffect(() => {
    const fetchNetworks = async () => {
      if (!hasMore) return;
      setLoading(true);
      setError(null);

      try {
        const response = await api.get(`/networks`, {
          params: {
            page,
            limit: 10,
            name: debouncedSearchTerm,
          },
        });

        const newNetworks = response.data.data || [];
        const pagination = response.data.pagination;

        setNetworks((prevNetworks) => {
          // If it's the first page, reset before appending
          if (page === 1) return newNetworks;
          const existingIds = new Set(prevNetworks.map((n) => n.id));
          const uniqueNewNetworks = newNetworks.filter(
            (n) => !existingIds.has(n.id)
          );
          return [...prevNetworks, ...uniqueNewNetworks];
        });

        setHasMore(pagination.page * pagination.limit < pagination.total);
      } catch (e) {
        if (e.response && e.response.status !== 404) {
          setError("Failed to fetch networks.");
        }
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    };

    fetchNetworks();
  }, [page, debouncedSearchTerm]);

  const observer = useRef();
  const lastNetworkElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return {
    networks,
    loading,
    error,
    lastNetworkElementRef,
    searchTerm,
    handleSearchChange,
  };
};
