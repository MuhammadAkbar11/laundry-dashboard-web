/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useMemo,
  useCallback,
} from 'react';

type DataType = {
  laundryQueueId: string | null;
  fetchQueryKey: any[];
  [key: string]: any;
};

type LaundryQueueDetailContextType = {
  data?: DataType | null;
  isOpen: boolean;
  isLoading: boolean;
  onSetLoading: (value: boolean) => void;
  onOpen: (data: DataType | null) => void;
  onClose: () => void;
};

const laundryQueueDetailContextDefaultValues: LaundryQueueDetailContextType = {
  isLoading: false,
  isOpen: false,
  onOpen: () => {},
  onSetLoading: () => {},
  onClose: () => {},
};

export const LaundryQueueDetailContext =
  createContext<LaundryQueueDetailContextType>(
    laundryQueueDetailContextDefaultValues
  );

export function useLaundryQueueDetailContext() {
  const context = useContext(LaundryQueueDetailContext);
  if (context === undefined) {
    throw new Error(
      'useLaundryQueueDetailContext must wrapper in the provider'
    );
  }

  return context;
}

type Props = {
  children: ReactNode;
};

export function LaundryQueueDetailProvider({ children }: Props) {
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

  const value: LaundryQueueDetailContextType = useMemo(
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
    <LaundryQueueDetailContext.Provider value={value}>
      {children}
    </LaundryQueueDetailContext.Provider>
  );
}
