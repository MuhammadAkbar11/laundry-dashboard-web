/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { IPayment } from '@interfaces';
import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useMemo,
  useCallback,
} from 'react';

type DataType = {
  payment: Omit<IPayment, 'laundryQueue' | 'user'>;
  totalPrice: number;
  totalDiscount: number;
};

type LaundryPaymentRespondContextType = {
  data?: DataType | null;
  isOpen: boolean;
  isLoading: boolean;
  onSetLoading: (value: boolean) => void;
  onOpen: (data: DataType | null) => void;
  onClose: () => void;
};

const laundryPaymentRespondContextDefaultValues: LaundryPaymentRespondContextType =
  {
    isLoading: false,
    isOpen: false,
    onOpen: () => {},
    onSetLoading: () => {},
    onClose: () => {},
  };

export const LaundryPaymentRespondContext =
  createContext<LaundryPaymentRespondContextType>(
    laundryPaymentRespondContextDefaultValues
  );

export function useLaundryPaymentRespondContext() {
  const context = useContext(LaundryPaymentRespondContext);
  if (context === undefined) {
    throw new Error(
      'useLaundryPaymentRespondContext must wrapper in the provider'
    );
  }

  return context;
}

type Props = {
  children: ReactNode;
};

export function LaundryPaymentRespondProvider({ children }: Props) {
  const [data, setData] = useState<DataType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const onClose = () => {
    setIsOpen(false);
    setIsLoading(false);
  };

  const onOpen = useCallback((payload: DataType | null) => {
    setIsOpen(true);
    setIsLoading(false);
    setData(payload);
  }, []);

  const value: LaundryPaymentRespondContextType = useMemo(
    () => ({
      isLoading,
      isOpen,
      data,
      onOpen,
      onClose,
      onSetLoading: setIsLoading,
    }),
    [data, onOpen, isOpen, isLoading]
  );

  return (
    <LaundryPaymentRespondContext.Provider value={value}>
      {children}
    </LaundryPaymentRespondContext.Provider>
  );
}
