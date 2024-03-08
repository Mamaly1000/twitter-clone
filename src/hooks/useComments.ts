import fetcher from "@/libs/fetcher";
import { Comment } from "@prisma/client";
import { useEffect, useState } from "react";
import useSWRInfinite from "swr/infinite";
import qs from "query-string";
import { useInView } from "react-intersection-observer";
import { debounce } from "lodash";

export type commentsQueryType = {
  postId?: string;
};
const useComments = (params?: commentsQueryType) => {
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

  const {
    data,
    error,
    size,
    setSize,
    mutate,
    isLoading: commentLoading,
  } = useSWRInfinite<{
    comments: Comment[];
    pagination: any;
  }>(
    (index) => {
      let query = qs.stringifyUrl({
        url: "/api/comments",
        query: {
          page: index + 1,
          postId: params?.postId,
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

  const comments: Comment[] = data
    ? [].concat(...(data.map((page) => page.comments) as any))
    : [];

  return {
    comments: comments as Array<Comment>,
    error,
    isLoading: commentLoading,
    mutate,
    pagination,
    ref,
  };
};

export default useComments;
