/* eslint-disable @typescript-eslint/no-explicit-any */
import { ILaundryRoom } from '@interfaces';
import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useMemo,
} from 'react';

interface IData {
  laundryRoom: ILaundryRoom;
  totalPrice: number;
  totalDiscount: number;
  fetchQueryKey: any[];
}

interface ILaundryPaymentContext {
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

const laundryPaymentContextDefaultValues: ILaundryPaymentContext = {
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

export const LaundryPaymentContext = createContext<ILaundryPaymentContext>(
  laundryPaymentContextDefaultValues
);

export function useLaundryPaymentContext() {
  const context = useContext(LaundryPaymentContext);
  if (context === undefined) {
    throw new Error('useLaundryPaymentContext must wrapper in the provider');
  }

  return context;
}

type Props = {
  children: ReactNode;
};

export function LaundryPaymentProvider({ children }: Props) {
  const [error, setError] = useState(null);
  const [data, setData] = useState<IData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const onSetError = (errorPayload: any) => {
    setError(errorPayload);
  };
  const onSetLoading = (value: boolean) => setIsLoading(value);
  const onSetSuccess = (value: boolean) => setIsSuccess(value);
  const onCloseModal = () => {
    setModal(false);
    setData(null);
  };
  const onOpenModal = (payload: IData | null) => {
    setIsSuccess(false);
    setIsLoading(false);
    setModal(true);
    setData(payload);
  };

  const value: ILaundryPaymentContext = useMemo(
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
    <LaundryPaymentContext.Provider value={value}>
      {children}
    </LaundryPaymentContext.Provider>
  );
}
