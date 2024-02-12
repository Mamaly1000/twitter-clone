import RecommentUserList from "@/components/lists/RecommendUserList";
import TrendHashtags from "@/components/shared/TrendHashtags";
import ScrollHideShowComponent from "@/components/ui/ScrollComponent";
import useRecommendedUsers from "@/hooks/useRecommendedUsers";
import useTrendHashtags from "@/hooks/useTrendHashtags";
import React from "react";

const FollowBar = () => {
  const { users } = useRecommendedUsers();
  const { hashtags } = useTrendHashtags();

  return (
    <ScrollHideShowComponent
      className="p-4 hidden xl:flex col-span-3 items-start justify-start flex-col gap-3  "
      targetElement={
        <div className="min-w-full flex flex-col gap-5 max-h-screen h-full min-h-full overflow-y-auto overflow-x-hidden">
          <RecommentUserList users={users} />
          <TrendHashtags hashtags={hashtags || []} />
        </div>
      }
      target={{
        className: "min-w-full flex flex-col gap-5 sticky  ",
        inVisibleClassname: "translate-y-0 top-2",
        visibleClassname: "translate-y-0 top-2",
      }}
    />
  );
};

export default FollowBar;
