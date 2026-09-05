import "../css/App.css";

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
import { RequireAuth } from "../features/auth/RequireAuth";
import { NetworkStatus } from "../shared/network/NetworkStatus";
import { EditCareRecipientInfo } from "../features/careRecipient/EditCareRecipientInfo";
import { SelectCareRecipients } from "../features/careRecipient/SelectCareRecipients";
import { PostCareRecipientDetail } from "../features/careRecipient/PostCareRecipientDetail";

function App() {
  return (
    <>
    <NetworkStatus/>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/googleLogin" element={<GoogleLogin />} />

        <Route path="/postList" element={
          <RequireAuth> 
            <PostListLayout /> 
          </RequireAuth>}>
          <Route index element={<PostList />} />
          <Route path="/postList/createPost" element={<CreatePost />} />
          <Route path="/postList/comments/:postId" element={<Comments />} />
          <Route path="/postList/profile" element={<Profile />} />
          <Route
          path="/postList/careRecipient/:careRecipientId"
          element={<PostCareRecipientDetail />}/>
        </Route>
            <Route path="/profile/editProfile" element={
              <RequireAuth>
              <EditProfile />
              </RequireAuth>} />

            <Route path="/profile/editCareRecipientInfo" element={
              <RequireAuth>
              <EditCareRecipientInfo />
              </RequireAuth>} />

            <Route path="/profile/editCareRecipientInfo/:id" element={
              <RequireAuth>
              <EditCareRecipientInfo />
              </RequireAuth>} />

            <Route path="/selectCareRecipients" element={
              <RequireAuth>
              < SelectCareRecipients/>
              </RequireAuth>} />


      </Routes>
    </>
  );
}

export default App;

