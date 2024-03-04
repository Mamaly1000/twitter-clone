import fetcher from "@/libs/fetcher";
import { Post } from "@prisma/client";
import { useEffect, useState } from "react";
import useSWRInfinite from "swr/infinite";
import qs from "query-string";
import { useInView } from "react-intersection-observer";
import { debounce } from "lodash";

const initialLimit = 10;
export type PostsType =
  | "bookmark"
  | "liked"
  | "media"
  | "replies"
  | "comment"
  | "repost"
  | "hashtag";
export type postQueryType = {
  id?: string;
  type?: PostsType;
  postId?: string;
  hashtagId?: string;
};

const usePosts = (params: postQueryType) => {
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
    isLoading: postsLoading,
  } = useSWRInfinite<{
    posts: Post[];
    pagination: any;
  }>(
    (index) => {
      let query = qs.stringifyUrl({
        url: "/api/posts",
        query: {
          user_id: params.id,
          limit: initialLimit,
          page: index + 1,
          postId: params.postId,
          search: params.type,
          hashtagId: params.hashtagId,
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

  const posts: Post[] = data
    ? [].concat(...(data.map((page) => page.posts) as any))
    : [];

  return {
    posts: posts as Array<Post>,
    error,
    isLoading: postsLoading,
    mutate,
    pagination,
    ref,
  };
};

export default usePosts;
