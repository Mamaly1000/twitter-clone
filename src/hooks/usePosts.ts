import { PageRouter } from "@/libs/PageRouter";
import fetcher from "@/libs/fetcher";
import { Post } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR from "swr";

const initialLimit = 15;

const usePosts = (id?: string) => {
  const router = useRouter();
  const [isLoading, setLoading] = useState(false);
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

  const url = !!id
    ? `/api/posts?page=${router.query.page}&limit=${initialLimit}&user_id=${id}`
    : `/api/posts?page=${router.query.page}&limit=${initialLimit}`;

  const {
    data,
    error,
    isLoading: postsLoading,
    mutate,
  } = useSWR(url, fetcher, {
    errorRetryCount: 2,
    shouldRetryOnError: false,
  });

  const nextPage = async () => {
    setLoading(true);
    if (pagination.hasNext && pagination.nextPage) {
      const newurl = !!id
        ? `/api/posts?page=${
            +(router.query?.page || 1) + 1
          }&limit=${initialLimit}&user_id=${id}`
        : `/api/posts?page=${
            +(router.query?.page || 1) + 1
          }&limit=${initialLimit}`;
      await axios
        .get(newurl)
        .then(
          (res: {
            data: {
              posts: Post[];
              pagination: {
                hasPrev: boolean;
                hasNext: boolean;
                nextPage: number | null;
                prevPage: number | null;
                currentPage: number;
                totalItems: number;
                maxPages: number;
              };
            };
          }) => {
            setPagination(res.data.pagination);
            PageRouter(router, res.data.pagination.currentPage);
            window.scroll({ top: 0 });
          }
        )
        .finally(() => {
          setLoading(false);
        });
    }
  };
  const prevPage = async () => {
    setLoading(true);
    if (pagination.hasPrev && pagination.prevPage) {
      const newurl = !!id
        ? `/api/posts?page=${
            +(router.query?.page || 1) - 1
          }&limit=${initialLimit}&user_id=${id}`
        : `/api/posts?page=${
            +(router.query?.page || 1) - 1
          }&limit=${initialLimit}`;
      await axios
        .get(newurl)
        .then(
          (res: {
            data: {
              posts: Post[];
              pagination: {
                hasPrev: boolean;
                hasNext: boolean;
                nextPage: number | null;
                prevPage: number | null;
                currentPage: number;
                totalItems: number;
                maxPages: number;
              };
            };
          }) => {
            setPagination(res.data.pagination);
            PageRouter(router, res.data.pagination.currentPage);
            window.scroll({ top: 0 });
          }
        )
        .finally(() => {
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    if (router.query.page && data?.pagination) {
      setPagination({
        currentPage: +router.query.page,
        hasNext: data.pagination.hasNext,
        hasPrev: data.pagination.hasPrev,
        maxPages: data.pagination.maxPages,
        nextPage: data.pagination.nextPage,
        prevPage: data.pagination.prevPage,
        totalItems: data.pagination.totalItems,
      });
    }
  }, [router, setPagination, data]);

  return {
    posts: (data?.posts || []) as Array<Post>,
    error,
    isLoading: isLoading || postsLoading,
    mutate,
    pagination,
    nextPage,
    prevPage,
  };
};

export default usePosts;
