import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebaseConfig"; // ajuste o caminho

type UserData = {
  id: string; // <- use o mesmo valor do uid aqui, para compatibilidade
  uid: string;
  nome: string;
  email: string;
  numero: string;
  dataNascimento: string;
};

type UserContextType = {
  user: UserData | null;
  setUser: (user: UserData | null) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          id: firebaseUser.uid, // <- define corretamente aqui
          uid: firebaseUser.uid,
          nome: firebaseUser.displayName ?? "",
          email: firebaseUser.email ?? "",
          numero: "", // você pode preencher isso de outra fonte, como o Firestore
          dataNascimento: "", // idem acima
        });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser deve ser usado dentro de um UserProvider");
  }
  return context;
};
