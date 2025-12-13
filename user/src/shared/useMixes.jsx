import { useState, useEffect, useRef, useCallback } from "react";
import api from "../providers/api";
import { transformMixToPost } from "./formatters";

export const useMixes = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const isFetching = useRef(false);
  const observer = useRef();

 
  useEffect(() => {
    if (!hasMore && observer.current) {
      observer.current.disconnect();
    }
  }, [hasMore]); 

  const loadMoreRef = useCallback(
    (node) => {
      if (isFetching.current) return;

      if (observer.current) observer.current.disconnect(); 

      if (!hasMore) return; 

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetching.current) {
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [hasMore]
  );

  useEffect(() => {
    if (!hasMore || isFetching.current) {
      return;
    }

    const fetchMixes = async () => {
      isFetching.current = true;
      setLoading(true);
      setError(null);

      try {
        const response = await api.get(`/mixes?page=${page}&limit=10`);
        const mixesData = response.data.data || [];

        setPosts((prevPosts) => [
          ...prevPosts,
          ...mixesData.map(transformMixToPost),
        ]);

        if (mixesData.length === 0) {
          setHasMore(false);
        } else {
          setHasMore(response.data.pagination.next_page !== null);
        }
      } catch (err) {
        console.error("Failed to fetch mixes:", err);
        setError("Could not load the feed. Please try again later.");
      } finally {
        isFetching.current = false;
        setLoading(false);
        if (isInitialLoad) setIsInitialLoad(false);
      }
    };

    fetchMixes();
  }, [page]);

  return { posts, loading, error, hasMore, loadMoreRef, isInitialLoad };
};
