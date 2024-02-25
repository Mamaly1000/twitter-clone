import fetcher from "@/libs/fetcher";
import { useEffect, useState } from "react"; 
import useSWRInfinite from "swr/infinite";
import qs from "query-string";
import { debounce } from "lodash";
import { useInView } from "react-intersection-observer";

const useNotif = () => {
  const { inView, ref } = useInView();
  const [pagination, setPagination] = useState<{
    hasPrev: boolean;
    hasNext: boolean;
    nextPage: number | null;
    prevPage: number | null;
    currentPage: number;
    totalItems: number;
    maxPages: number;
  }>({
    currentPage: 1,
    hasNext: true,
    hasPrev: false,
    nextPage: null,
    prevPage: null,
    totalItems: 0,
    maxPages: 0,
  });
  const { data, error, size, setSize, mutate, isLoading } = useSWRInfinite<{
    notifications: Notification[];
    pagination: any;
  }>(
    (index) => {
      let query = qs.stringifyUrl({
        url: `/api/notifications`,
        query: {
          limit: 15,
          page: index + 1,
        },
      });
      return query;
    },
    fetcher,
    {
      errorRetryCount: 2,
      shouldRetryOnError: false,
    }
  );

  const nextPage = debounce((_val) => {
    if (inView && pagination.hasNext) {
      setSize(pagination.nextPage || 2);
    }
  }, 2000);

  useEffect(() => {
    nextPage(size);
    return () => {
      nextPage.cancel();
    };
  }, [nextPage]);

  useEffect(() => {
    if (data?.[0]?.pagination) {
      const pagination = data ? data[data.length - 1].pagination : null;

      setPagination({
        currentPage: +pagination.currentPage,
        hasNext: pagination.hasNext,
        hasPrev: pagination.hasPrev,
        maxPages: pagination.maxPages,
        nextPage: pagination.nextPage,
        prevPage: pagination.prevPage,
        totalItems: pagination.totalItems,
      });
    }
  }, [setPagination, data]);

  const notifs: Notification[] = data
    ? [].concat(...(data.map((page) => page.notifications) as any))
    : [];
  return { notifs, error, mutate, isLoading, ref, pagination };
};

export default useNotif;
