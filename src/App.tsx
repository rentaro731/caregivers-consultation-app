import "./App.css";

import { Routes, Route } from "react-router-dom";
import { LandingPage } from "./LandingPage";
import { PostList } from "./PostList";
import { Profile } from "./sideBar/Profile";
import { CreatePost } from "./sideBar/CreatePost";
import { SignUp } from "./SignUp";
import { Login } from "./Login";
import { Comments } from "./sideBar/Comments";
import { GoogleLogin } from "./GoogleLogin";
import { EditProfile } from "./EditProfile";
import { PostListLayout } from "./PostListLayout";

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
