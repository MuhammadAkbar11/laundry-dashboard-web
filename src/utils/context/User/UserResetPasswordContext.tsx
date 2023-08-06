/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { IUser } from '@interfaces';
import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useMemo,
} from 'react';

interface IData {
  user: IUser;
  fetchQueryKey: any[];
}

interface IUserResetPasswordContext {
  showModal: boolean;
  isLoading: boolean;
  isSuccess: boolean;
  data?: IData | null;
  error: any;
  onSetError: (error: any) => void;
  onSetLoading: (value: boolean) => void;
  onSetSuccess: (value: boolean) => void;
  onOpenModal: (data: IData | null) => void;
  onCloseModal: () => void;
  onReset?: () => void;
}

const userResetPasswordContextDefaultValues: IUserResetPasswordContext = {
  showModal: false,
  isLoading: false,
  isSuccess: false,
  error: null,
  onSetLoading: () => {},
  onSetSuccess: () => {},
  onSetError: () => {},
  onOpenModal: () => {},
  onCloseModal: () => {},
};

export const UserResetPasswordContext =
  createContext<IUserResetPasswordContext>(
    userResetPasswordContextDefaultValues
  );

export function useUserResetPasswordContext() {
  const context = useContext(UserResetPasswordContext);
  if (context === undefined) {
    throw new Error('useUserResetPasswordContext must wrapper in the provider');
  }

  return context;
}

type Props = {
  children: ReactNode;
};

export function UserResetPasswordProvider({ children }: Props) {
  const [error, setError] = useState(null);
  const [data, setData] = useState<IData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const onSetError = (error: any) => {
    setError(error);
  };
  const onSetLoading = (value: boolean) => setIsLoading(value);
  const onSetSuccess = (value: boolean) => setIsSuccess(value);
  const onCloseModal = () => {
    setModal(false);
    setData(null);
  };
  const onOpenModal = (data: IData | null) => {
    setIsSuccess(false);
    setIsLoading(false);
    setModal(true);
    setData(data);
  };

  const value: IUserResetPasswordContext = useMemo(
    () => ({
      showModal: modal,
      data,
      isLoading,
      isSuccess,
      error,
      onSetLoading,
      onSetSuccess,
      onSetError,
      onCloseModal,
      onOpenModal,
    }),
    [error, data, isLoading, isSuccess, modal]
  );

  return (
    <UserResetPasswordContext.Provider value={value}>
      {children}
    </UserResetPasswordContext.Provider>
  );
}
