import { createContext, useContext, useEffect, useState } from 'react';

type User = {
  id?: string,
  email?: string,
  name?: string
}

const GlobalContext = createContext<{
  setUser: (user: User) => void
  user: User
}>({
  setUser: () => {},
  user: {}
});

export function GlobalProvider({ children }: any) {
  const [user, setUser] = useState({});

  return (
    <GlobalContext.Provider value={{ user, setUser }}>
      {children}
    </GlobalContext.Provider>
  );
}

export function useGlobalProvider() {
  return useContext(GlobalContext);
}