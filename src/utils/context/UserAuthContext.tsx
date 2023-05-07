import { IUserAuth } from '@/services/authSevices';
import React, { createContext, ReactNode } from 'react';

type UserAuthContextType = {
  user: IUserAuth | null;
  isLoading: boolean;
  onSetUser: (user: IUserAuth) => void;
};

const pageDetailContextDefaultValues: UserAuthContextType = {
  user: null,
  isLoading: true,
  onSetUser: () => {},
};

export const UserAuthContext = createContext<UserAuthContextType>(
  pageDetailContextDefaultValues
);

export function useUserAuthContext() {
  const context = React.useContext(UserAuthContext);
  if (context === undefined) {
    throw new Error('useUserAuthContext must wrapper in the provider');
  }

  return { ...context };
}

type Props = {
  children: ReactNode;
};

export function UserAuthCtxProvider({ children }: Props) {
  const [loading, setLoading] = React.useState(true);
  const [userState, setUserState] = React.useState<IUserAuth | null>(null);

  const onSetUser = React.useCallback((user: IUserAuth) => {
    setLoading(false);
    setUserState(user);
    // eslint-disable-next-line no-console
    console.log('RELOAD USER AUTH');
  }, []);

  const value: UserAuthContextType = React.useMemo(
    () => ({
      user: userState,
      isLoading: loading,
      onSetUser,
    }),
    [loading, userState, onSetUser]
  );

  return (
    <UserAuthContext.Provider value={value}>
      {children}
    </UserAuthContext.Provider>
  );
}
