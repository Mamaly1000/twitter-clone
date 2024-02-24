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
        className="min-w-full p-0 m-0 flex flex-col justify-center items-center w-full max-h-[100px] "
        ref={ref}
      >
        <Loader className="min-h-[100px] max-h-[100px] " size={25} type="bounce" />
      </section>
    )
  );
}

export default Pagination;
