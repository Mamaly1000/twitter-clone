 
import Header from "@/containers/Header";
import CreatePost from "@/components/forms/CreatePost";
import PostFeed from "@/components/lists/PostFeed ";
 
export default function Home() {
  return (
    <div className=" text-white">
      <Header label="Home" />
      <CreatePost placeholder="your tweet ...." />
      <PostFeed />
    </div>
  );
}
