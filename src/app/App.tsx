import "./App.css";

import { Routes, Route } from "react-router-dom";
import { LandingPage } from "../features/landing/LandingPage";
import { PostList } from "../features/post/PostList";
import { Profile } from "../features/profile/Profile";
import { CreatePost } from "../features/post/CreatePost";
import { SignUp } from "../features/auth/SignUp";
import { Login } from "../features/auth/Login";
import { Comments } from "../features/post/Comments";
import { GoogleLogin } from "../features/auth/GoogleLogin";
import { EditProfile } from "../features/profile/EditProfile";
import { PostListLayout } from "../features/post/PostListLayout";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/googleLogin" element={<GoogleLogin />} />

        <Route path="/postList" element={<PostListLayout />}>
          <Route index element={<PostList />} />
          <Route path="/postList/createPost" element={<CreatePost />} />
          <Route path="/postList/comments" element={<Comments />} />
          <Route path="/postList/profile" element={<Profile />} />
          <Route
            path="/postList/profile/editProfile"
            element={<EditProfile />}
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;
