import { useLocation, NavLink, Outlet } from "react-router-dom";
import styles from "../../css/postListLayout.module.css";
import { LuHeartHandshake } from "react-icons/lu";

type NavLinkType = {
  to: string;
  title: string;
  icon: string;
  isActive: boolean;
};

export const PostListLayout = () => {
  const location = useLocation();
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
        <button className={styles.logout}>ログアウト</button>
      </aside>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
};
