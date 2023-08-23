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
  openMemberSidebar: boolean;
  onToggleModalSignOut: () => void;
  onToggleMemberSidebar: () => void;
  onCloseModalSignOut: () => void;
};

const webLayoutContextDefaultValues: WebLayoutType = {
  openModalSignOut: false,
  openMemberSidebar: false,
  onToggleModalSignOut: () => {},
  onToggleMemberSidebar: () => {},
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
  const [openMemberSidebar, setOpenMemberSidebar] = useState(false);

  const onToggleModalSignOut = useCallback(() => {
    setOpenModalSignOut(!openModalSignOut);
  }, [openModalSignOut]);

  const onToggleMemberSidebar = useCallback(() => {
    setOpenMemberSidebar(!openMemberSidebar);
  }, [openMemberSidebar]);

  const onCloseModalSignOut = useCallback(() => {
    setOpenModalSignOut(false);
  }, []);

  const value: WebLayoutType = useMemo(
    () => ({
      openMemberSidebar,
      onToggleMemberSidebar,
      openModalSignOut,
      onToggleModalSignOut,
      onCloseModalSignOut,
    }),
    [
      openModalSignOut,
      onToggleModalSignOut,
      onCloseModalSignOut,
      openMemberSidebar,
      onToggleMemberSidebar,
    ]
  );

  return <WebLayout.Provider value={value}>{children}</WebLayout.Provider>;
}
