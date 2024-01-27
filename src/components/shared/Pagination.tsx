import usePosts from "@/hooks/usePosts";
import { GrCaretNext, GrCaretPrevious } from "react-icons/gr";
function Pagination() {
  const { pagination, isLoading, nextPage, prevPage } = usePosts();
  return (
    <section className="min-w-full p-0 m-0 flex flex-col justify-center items-center w-full">
      <div>
        <div className="min-w-full flex items-center justify-center gap-3 p-5">
          <button
            className="active:scale-90 hover:scale-110 transition-all w-10 h-10 rounded-lg drop-shadow-2xl bg-sky-500 text-white flex items-center justify-center max-w-10 max-h-10 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading || !pagination.hasPrev}
            onClick={prevPage}
          >
            <GrCaretPrevious />
          </button>
          <span className="w-fit min-w-10 min-h-10 max-h-10 h-10 rounded-lg drop-shadow-2xl text-white border-[1px] border-sky-500 px-3 flex items-center justify-center py-2 cursor-default">
            {pagination.currentPage}
          </span>
          <button
            className="active:scale-90 hover:scale-110 transition-all w-10 h-10 rounded-lg drop-shadow-2xl bg-sky-500 text-white flex items-center justify-center max-w-10 max-h-10 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading || !pagination.hasNext}
            onClick={nextPage}
          >
            <GrCaretNext />
          </button>
        </div>
      </div>
    </section>
  );
}

export default Pagination;
