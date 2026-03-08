import Loading from '@/components/Loading';
import { SignInTypeEnum } from '@/types/SignInTypeEnum';
import { createContext, useContext, useEffect, useState } from 'react';

type User = {
  id?: string,
  email?: string,
  name?: string,
  createdAt?: string,
  avatar?: string,
  signinType?: SignInTypeEnum
}

const GlobalContext = createContext<{
  user: User | null,
  setUser: (user: User | null) => void
  token: string | null,
  setToken: (token: string | null) => void
  loading: boolean,
  setLoading: (loading: boolean) => void
}>({
  user: {},
  setUser: () => { },
  token: null,
  setToken: () => { },
  loading: false,
  setLoading: () => { }
});

export function GlobalProvider({ children }: any) {
  const [user, setUser] = useState<User | null>({});
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  return <>
    {loading == true ? <Loading /> : <></>}

    <GlobalContext.Provider value={{
      user,
      setUser,
      token,
      setToken,
      loading,
      setLoading
    }}>
      {children}
    </GlobalContext.Provider>
  </>
}

export function useGlobalProvider() {
  return useContext(GlobalContext);
}