import { createContext, useContext, useState } from 'react';

type User = {
  id?: string,
  email?: string,
  name?: string,
  createdAt?: string
}

const GlobalContext = createContext<{
  user: User | null,
  setUser: (user: User | null) => void
  token: string | null,
  setToken: (token: string | null) => void
}>({
  user: {},
  setUser: () => {},
  token: null,
  setToken: () => {},
});

export function GlobalProvider({ children }: any) {
  const [user, setUser] = useState<User | null>({});
  const [token, setToken] = useState<string | null>(null);

  return (
    <GlobalContext.Provider value={{ 
      user, 
      setUser,
      token,
      setToken
    }}>
      {children}
    </GlobalContext.Provider>
  );
}

export function useGlobalProvider() {
  return useContext(GlobalContext);
}