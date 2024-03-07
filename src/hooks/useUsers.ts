import fetcher from "@/libs/fetcher";
import { User } from "@prisma/client";
import { debounce } from "lodash";
import { useEffect, useState } from "react";
import useSWRInfinite from "swr/infinite";
import qs from "query-string";
import { useInView } from "react-intersection-observer";
export type UsersTypes =
  | "all"
  | "followers"
  | "followings"
  | "single-user"
  | "recommended"
  | "hashtag";
export type usersParams =
  | {
      search?: string | undefined;
      userId?: string | undefined;
      type?: UsersTypes | undefined;
      hashtagId?: string;
    }
  | undefined;
const useUsers = (params?: usersParams) => {
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
    isLoading: usersLoading,
  } = useSWRInfinite<{
    users: User[];
    pagination: any;
  }>(
    (index) => {
      let query = qs.stringifyUrl({
        url: "/api/users",
        query: {
          userId: params?.userId,
          page: index + 1,
          search: params?.search?.trim(),
          type: params?.type || "all",
          hashtagId: params?.hashtagId,
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

  const users: User[] = data
    ? [].concat(...(data.map((page) => page.users) as any))
    : [];

  return {
    users: (!!users && users.length > 0 ? users : []) as User[],
    error,
    usersLoading,
    mutate,
    pagination,
    ref,
  };
};

export default useUsers;
