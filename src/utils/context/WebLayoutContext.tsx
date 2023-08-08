/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-shadow */
import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useMemo,
  useCallback,
} from 'react';

type WebLayoutType = {
  openModalSignOut: boolean;
  onToggleModalSignOut: () => void;
  onCloseModalSignOut: () => void;
};

const webLayoutContextDefaultValues: WebLayoutType = {
  openModalSignOut: false,
  onToggleModalSignOut: () => {},
  onCloseModalSignOut: () => {},
};

export const WebLayout = createContext<WebLayoutType>(
  webLayoutContextDefaultValues
);

export function useWebLayoutContext() {
  const context = useContext(WebLayout);
  if (context === undefined) {
    throw new Error('useWebLayout must wrapper in the provider');
  }

  return context;
}

type Props = {
  children: ReactNode;
};

export function WebLayoutCtxProvider({ children }: Props) {
  const [openModalSignOut, setOpenModalSignOut] = useState(false);

  const onToggleModalSignOut = useCallback(() => {
    setOpenModalSignOut(!openModalSignOut);
  }, [openModalSignOut]);

  const onCloseModalSignOut = useCallback(() => {
    setOpenModalSignOut(false);
  }, []);

  const value: WebLayoutType = useMemo(
    () => ({
      openModalSignOut,
      onToggleModalSignOut,
      onCloseModalSignOut,
    }),
    [openModalSignOut, onToggleModalSignOut, onCloseModalSignOut]
  );

  return <WebLayout.Provider value={value}>{children}</WebLayout.Provider>;
}
