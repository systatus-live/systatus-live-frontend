import { createContext, useContext, useEffect, useState } from 'react';

type User = {
  id?: string,
  email?: string,
  name?: string
}

const GlobalContext = createContext<{
  user: User,
  setUser: (user: User) => void
  token: string | null,
  setToken: (token: string | null) => void
}>({
  user: {},
  setUser: () => {},
  token: null,
  setToken: () => {},
});

export function GlobalProvider({ children }: any) {
  const [user, setUser] = useState<User>({});
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