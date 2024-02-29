import fetcher from "@/libs/fetcher";
import { Hashtag } from "@prisma/client";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import qs from "query-string";
import useSWRInfinite from "swr/infinite";
import { debounce } from "lodash";
import { useRouter } from "next/router";

const useHashtags = (params?: { search?: string; hashtagId?: string }) => {
  const { inView, ref } = useInView();
  const router = useRouter();
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

  const {
    data,
    error,
    size,
    setSize,
    mutate,
    isLoading: hashtagLoading,
  } = useSWRInfinite<{
    hashtags: Hashtag[];
    pagination: any;
  }>(
    (index) => {
      let query = qs.stringifyUrl({
        url: "/api/hashtags",
        query: {
          page: index + 1,
          hashtagId: params?.hashtagId,
          search: (router.query.search as string)?.trim().toLowerCase(),
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

  const posts: Hashtag[] = data
    ? [].concat(...(data.map((page) => page.hashtags) as any))
    : [];

  return {
    hashtags: posts as Array<Hashtag>,
    error,
    isLoading: hashtagLoading,
    mutate,
    pagination,
    ref,
  };
};

export default useHashtags;
