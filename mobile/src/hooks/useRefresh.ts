import { useState } from "react";

// Tracks user-initiated refreshes only, so background refetches don't show the spinner.
export const useRefresh = (refetchers: (() => Promise<unknown>)[]) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const onRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all(refetchers.map((refetch) => refetch()));
    } finally {
      setIsRefreshing(false);
    }
  };

  return { isRefreshing, onRefresh };
};
