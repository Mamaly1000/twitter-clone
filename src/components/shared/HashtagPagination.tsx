import React, { useEffect, useState } from "react";
import Loader from "./Loader";
import useHashtags from "@/hooks/useHashtags";

const HashtagPagination = ({
  params,
}: {
  params?: {
    search?: string | undefined;
    hashtagId?: string | undefined;
  };
}) => {
  const { isLoading, ref, pagination } = useHashtags(params);
  const [hasMore, setHasMore] = useState(true);
  useEffect(() => {
    if (pagination && pagination.hasNext) {
      setHasMore(true);
    }
  }, [pagination]);

  return (
    !isLoading &&
    hasMore &&
    !(+pagination.maxPages === +pagination.currentPage) && (
      <section
        className="min-w-full p-0 m-0 flex flex-col justify-center items-center w-full max-h-[100px] "
        ref={ref}
      >
        <Loader
          className="min-h-[100px] max-h-[100px] "
          size={25}
          type="bounce"
        />
      </section>
    )
  );
};

export default HashtagPagination;
