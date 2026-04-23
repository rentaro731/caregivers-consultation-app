import { Routes, Route } from "react-router-dom";
import { LandingPage } from "./LandingPage";
import { PostList } from "./PostList";
import { Profile } from "./Profile";
import { CreatePost } from "./CreatePost";
import { SignUp } from "./SignUp";
import { Login } from "./Login";
import { Comments } from "./Comments";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/postList" element={<PostList />} />
        <Route path="/postList/profile" element={<Profile />} />
        <Route path="/postList/createPost" element={<CreatePost />} />
        <Route path="/postList/comments" element={<Comments />} />
      </Routes>
    </>
  );
}

export default App;
