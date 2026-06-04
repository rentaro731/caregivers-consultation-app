import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./firebaseConfig";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { doc, onSnapshot } from "firebase/firestore";

type User = {
  id?: string;
  name?: string;
  email?: string;
  bio?: string;
};
type UserContextType = {
  user: User | null;
  loading: boolean;
};

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      try {
        if (!firebaseUser) {
          setUser(null);
          setLoading(false);
          return;
        }
        const uid = firebaseUser.uid;
        const ref = doc(db, "users", uid);

        const unsubscribeUser = onSnapshot(ref, (snap) => {
          const snapData = snap.data();
          setUser({
            id: firebaseUser?.uid ?? "",
            name: snapData?.name ?? "",
            email: firebaseUser.email ?? "",
            bio: snapData?.bio ?? "",
          });
        });
        return () => {
          unsubscribeUser?.();
        };
      } catch (error) {
        console.error("UserContext error:", error);
        setUser({
          id: firebaseUser?.uid ?? "",
          email: firebaseUser?.email ?? "",
        });
      } finally {
        setLoading(false);
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider value={{ user, loading }}>
      {children}
    </UserContext.Provider>
  );
};
export const useUserContext = () => useContext(UserContext);
