/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ILaundryService } from '@interfaces';
import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useMemo,
} from 'react';

interface IData {
  laundryService: ILaundryService;
  fetchQueryKey: any[];
}

interface ILaundryServiceDeleteContext {
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

const laundryServiceDeleteContextDefaultValues: ILaundryServiceDeleteContext = {
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

export const LaundryServiceDeleteContext =
  createContext<ILaundryServiceDeleteContext>(
    laundryServiceDeleteContextDefaultValues
  );

export function useLaundryServiceDeleteContext() {
  const context = useContext(LaundryServiceDeleteContext);
  if (context === undefined) {
    throw new Error(
      'useLaundryServiceDeleteContext must wrapper in the provider'
    );
  }

  return context;
}

type Props = {
  children: ReactNode;
};

export function LaundryServiceDeleteProvider({ children }: Props) {
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

  const value: ILaundryServiceDeleteContext = useMemo(
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
    <LaundryServiceDeleteContext.Provider value={value}>
      {children}
    </LaundryServiceDeleteContext.Provider>
  );
}
