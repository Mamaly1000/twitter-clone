import { mutualFollower } from "@/hooks/useUser";
import React from "react";
import Avatar from "../shared/Avatar";
import { twMerge } from "tailwind-merge";
import { formatString } from "../../libs/wordDetector";

const MutualFollowers = ({
  followers,
  others = 0,
}: {
  others?: number;
  followers: mutualFollower[];
}) => {
  return (
    followers.length >= 3 && (
      <section className="mt-3 min-w-full max-w-full flex items-center justify-start gap-2">
        <div className="flex items-center justify-start min-w-[65px] md:min-w-[35px] min-h-[18px] relative  ">
          {followers.map((f, i) => {
            return (
              <Avatar
                key={f.id}
                userId={f.id}
                className={twMerge(
                  "min-w-[30px] max-w-[30px] min-h-[30px] max-h-[30px] h-[30px] w-[30px] md:min-w-[18px] md:max-w-[18px] md:min-h-[18px] md:max-h-[18px] md:h-[18px] md:w-[18px] absolute drop-shadow-2xl border-[1px] border-black ",
                  i === 1 && `start-4 md:start-2 z-20`,
                  i === 2 && "start-8 md:start-4 z-30"
                )}
              />
            );
          })}
        </div>
        <p
          dangerouslySetInnerHTML={{
            __html: formatString(
              `followed by @${followers[0].username}, @${
                followers[1].username
              }, @${followers[2].username}${
                others > 0 &&
                `, and ${others} ${others > 2 ? "others" : "more"}`
              }`
            ),
          }}    
          className="max-w-[55%] gap-[2px] sm:max-w-[60%] md:max-w-[70%] flex flex-wrap gap-y-1 items-start justify-start text-[#72767A] font-[400] leading-[13px] text-[13px]"
        ></p>
      </section>
    )
  );
};

export default MutualFollowers;
