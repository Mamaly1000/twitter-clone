import usePosts, { postQueryType } from "@/hooks/usePosts";
import { useEffect, useState } from "react";
import Loader from "./Loader";
function Pagination({ params }: { params: postQueryType }) {
  const { isLoading, ref, pagination } = usePosts({
    id: params.id,
    type: params.type,
  });
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
        className="min-w-full p-0 m-0 flex flex-col justify-center items-center w-full"
        ref={ref}
      >
        <Loader />
      </section>
    )
  );
}

export default Pagination;
