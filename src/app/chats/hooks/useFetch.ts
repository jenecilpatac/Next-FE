import { useState, useEffect, useRef } from "react";
import api from "../../lib/axiosCall";

const useFetch = (
  url: any,
  isRefresh: boolean,
  isPaginated: boolean,
  isSearched: boolean
) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loadingOnTake, setLoadingOnTake] = useState(false);
  const [loadingOnTakeMessages, setLoadingOnTakeMessages] = useState(false);
  const [loadingOnSearch, setLoadingOnSearch] = useState(false);
  const [error, setError] = useState(null);
  const [addTake, setAddTake] = useState(0);
  const [addTakeMessages, setAddTakeMessages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const defaultTake = 20;

  useEffect(() => {
    if (!url) return;
    setError(null);
    if (addTake) {
      setLoadingOnTake(true);
    }
    if (addTakeMessages) {
      setLoadingOnTakeMessages(true);
    }
    if (searchTerm) {
      setLoadingOnSearch(true);
    }
    const fetchData = async () => {
      const params: any = {};

      if (isPaginated) {
        params.take = defaultTake + addTake;
        params.takeMessages = defaultTake + addTakeMessages;
      }
      if (isSearched) {
        params.searchTerm = searchTerm;
      }

      try {
        const response = await api.get(url, {
          params,
        });
        setData(response.data);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);

        if (addTake) {
          setLoadingOnTake(false);
        }
        if (addTakeMessages) {
          setLoadingOnTakeMessages(false);
        }
        if (searchTerm) {
          setLoadingOnSearch(false);
        }
      }
    };

    fetchData();
  }, [url, isRefresh, addTake, searchTerm, addTakeMessages]);

  return {
    data,
    loading,
    error,
    setAddTake,
    loadingOnTake,
    setSearchTerm,
    searchTerm,
    loadingOnSearch,
    setAddTakeMessages,
    loadingOnTakeMessages,
  };
};

export default useFetch;
