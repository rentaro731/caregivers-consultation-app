import { useLocation, NavLink, Outlet, useNavigate } from "react-router-dom";
import styles from "../../css/postListLayout.module.css";
import { LuHeartHandshake } from "react-icons/lu";
import { signOut } from "firebase/auth";
import { auth } from "../../shared/firebase/firebaseConfig";

type NavLinkType = {
  to: string;
  title: string;
  icon: string;
  isActive: boolean;
};

export const PostListLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const navLinks: NavLinkType[] = [
    {
      to: "/postList",
      title: "投稿一覧",
      icon: "🏘️",
      isActive: location.pathname === "/postList",
    },
    {
      to: "/postList/createPost",
      title: "投稿作成",
      icon: "✏️",
      isActive: location.pathname.includes("createPost"),
    },
    {
      to: "/postList/profile",
      title: "プロフィール",
      icon: "👤",
      isActive: location.pathname.includes("profile"),
    },
  ];

  const logout =async ()=>{
    if (!window.confirm("ログアウトしますか")){
      return;
    } 
    try {
      await signOut(auth)
      navigate("/")
    }catch(error){
      console.error("ログアウトに失敗しました", error);
    }
  }

  return (
    <div className={styles.postListContainer}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
        <LuHeartHandshake  size={40}/>
          <p className={styles.categoryTitle}>介護相談</p>
        </div>

        {navLinks.map((link) => (
          <NavLink key={link.to} to={link.to} className={styles.navItem}>
            {link.icon}
            {link.title}
          </NavLink>
        ))}
        <button className={styles.logout} onClick={logout}>ログアウト</button>
      </aside>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
};
