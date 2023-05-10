/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-shadow */
import messagesData from '@utils/dummyData/messages';
import notificationsData from '@utils/dummyData/notifications';
import { IMessage, INotification } from '@utils/interfaces';
import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useMemo,
  useCallback,
} from 'react';

type AdminLayoutType = {
  openSidebar: boolean;
  openModalSignOut: boolean;
  notifications: INotification[];
  messages: IMessage[];
  onToggleSidebar: () => void;
  onToggleModalSignOut: () => void;
  onCloseModalSignOut: () => void;
};

const adminLayoutContextDefaultValues: AdminLayoutType = {
  openModalSignOut: false,
  openSidebar: true,
  notifications: [],
  messages: [],
  onToggleSidebar: () => {},
  onToggleModalSignOut: () => {},
  onCloseModalSignOut: () => {},
};

export const AdminLayout = createContext<AdminLayoutType>(
  adminLayoutContextDefaultValues
);

export function useAdminLayoutContext() {
  const context = useContext(AdminLayout);
  if (context === undefined) {
    throw new Error('useAdminLayout must wrapper in the provider');
  }

  return context;
}

type Props = {
  children: ReactNode;
};

export function AdminLayoutCtxProvider({ children }: Props) {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [openModalSignOut, setOpenModalSignOut] = useState(false);

  const onToggleSidebar = useCallback(() => {
    setOpenSidebar(!openSidebar);
  }, [openSidebar]);

  const onToggleModalSignOut = useCallback(() => {
    setOpenModalSignOut(!openModalSignOut);
  }, [openModalSignOut]);

  const onCloseModalSignOut = useCallback(() => {
    setOpenModalSignOut(false);
  }, []);

  const value: AdminLayoutType = useMemo(
    () => ({
      openSidebar,
      openModalSignOut,
      onToggleSidebar,
      onToggleModalSignOut,
      onCloseModalSignOut,
      messages: messagesData,
      notifications: notificationsData,
    }),
    [
      openSidebar,
      onToggleSidebar,
      openModalSignOut,
      onToggleModalSignOut,
      onCloseModalSignOut,
    ]
  );

  return <AdminLayout.Provider value={value}>{children}</AdminLayout.Provider>;
}
