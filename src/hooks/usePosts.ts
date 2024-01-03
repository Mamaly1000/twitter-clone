import fetcher from "@/libs/fetcher";
import React from "react";
import useSWR from "swr";

const usePosts = (id?: string) => {
  const url = !!id ? `/api/posts?user_id=${id}` : "/api/posts";
  const { data: posts, error, isLoading, mutate } = useSWR(url, fetcher);

  return {
    posts: posts && posts.length > 0 ? posts : [],
    error,
    isLoading,
    mutate,
  };
};

export default usePosts;
