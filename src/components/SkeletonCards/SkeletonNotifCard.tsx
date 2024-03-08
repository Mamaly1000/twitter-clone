import React from "react";
import { motion } from "framer-motion";

const SkeletonNotifCard = () => {
  return (
    <motion.article className="flex flex-row items-start justify-start py-2 px-3 gap-4 border-b-[1px] border-neutral-800 min-w-full max-w-full cursor-pointer hover:opacity-80 transition-all">
      <div className="w-fit max-w-fit flex items-start justify-start flex-col gap-2">
        <div className="min-w-[35px] min-h-[35px] rounded-lg drop-shadow-2xl skeleton"></div>
      </div>
      <section className="overflow-hidden flex items-start justify-between gap-3 md:flex-row flex-col max-w-[calc(100%-36px)] md:max-w-[calc(100%-46px)] min-w-[calc(100%-36px)] md:min-w-[calc(100%-46px)]">
        <div className=" min-w-full max-w-full md:min-w-[calc(100%-62px)] md:max-w-[calc(100%-62px)] overflow-hidden flex flex-col items-start justify-start gap-3 text-[12px] md:text-[15px]">
          {/* notif header */}
          <div className="flex flex-col md:flex-row items-start justify-start gap-2">
            <div className="min-w-[40px] min-h-[40px] rounded-full skeleton drop-shadow-2xl"></div>
            <div className="flex items-start justify-start flex-wrap gap-2 md:max-w-[200px]">
              <p className="min-w-[100px] min-h-[15px] rounded-full drop-shadow-2xl skeleton"></p>
              <span className="min-w-[70px] min-h-[15px] rounded-full drop-shadow-2xl skeleton"></span>
              <p className="min-w-[45px] min-h-[15px] rounded-full drop-shadow-2xl skeleton"></p>
            </div>
          </div>
          {/* notif content */}
          <div className="flex flex-col items-start justify-start min-w-full max-w-full ">
            {/* notif body */}
            <p className="min-w-full flex flex-col items-start justify-start gap-2">
              <span className="min-w-[80%] min-h-[15px] rounded-full drop-shadow-2xl skeleton"></span>
              <span className="min-w-[75%] min-h-[15px] rounded-full drop-shadow-2xl skeleton"></span>
            </p>
          </div>
        </div>
        <span className="min-w-[50px] min-h-[15px] rounded-full skeleton"></span>
      </section>
    </motion.article>
  );
};

export default SkeletonNotifCard;
