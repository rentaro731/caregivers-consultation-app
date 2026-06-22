import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase/firebaseConfig";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { doc, getDoc } from "firebase/firestore";

type User = {
  id?: string;
  name?: string;
  email?: string;
  bio?: string;
};
type UserContextType = {
  user: User | null;
  profile: User | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
};

const UserContext = createContext<UserContextType>({
  user: null,
  profile: null,
  loading: true,
  refreshProfile: async () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser({ id: firebaseUser?.uid });
      try {
        if (!firebaseUser) {
          setUser(null);
          setProfile(null);
          setLoading(false);
          return;
        }
        const uid = firebaseUser.uid;
        const ref = doc(db, "users", uid);
        const snap = await getDoc(ref);
        setProfile(snap.exists() ? { id: snap.id, ...snap.data() } : null);
      } catch (error) {
        console.error("ユーザーデータの取得に失敗しました:", error);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const refreshProfile = async () => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }
    const ref = doc(db, "users", user.id!);
    const snap = await getDoc(ref);
    setProfile(snap.exists() ? { id: snap.id, ...snap.data() } : null);
  };

  return (
    <UserContext.Provider value={{ user, profile, loading, refreshProfile }}>
      {children}
    </UserContext.Provider>
  );
};
export const useUserContext = () => useContext(UserContext);
