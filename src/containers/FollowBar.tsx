import React from "react";
import RecommentUserList from "@/components/lists/RecommendUserList";
import TrendHashtags from "@/components/shared/TrendHashtags";
import ScrollHideShowComponent from "@/components/ui/ScrollComponent";
import useCurrentUser from "@/hooks/useCurrentUser";
import useUserLocation from "@/hooks/useUserLocation";

const FollowBar = () => {
  const { data: user } = useCurrentUser();
  const { location } = useUserLocation(user?.id);
  return (
    <ScrollHideShowComponent
      className="p-4 hidden lg:flex col-span-3 items-start justify-start flex-col gap-3  pb-10"
      targetElement={
        <div className="scroll-hidden w-full xl:max-w-[90%] flex flex-col gap-5 max-h-screen h-full min-h-full overflow-y-auto overflow-x-hidden pb-5">
          <RecommentUserList />
          <TrendHashtags userLocation={location} />
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
