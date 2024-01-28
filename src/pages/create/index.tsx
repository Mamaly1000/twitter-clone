import CreatePost from "@/components/forms/CreatePost";
import Header from "@/containers/Header";
import React from "react";

const CreateTweetPage = () => {
  return (
    <div>
      <Header label="create a tweet" displayArrow />
      <CreatePost mainPage placeholder="what's happening?" />
    </div>
  );
};

export default CreateTweetPage;
