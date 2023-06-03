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
  onOpen: (data: DataType | null) => void;
  onClose: () => void;
};

const laundryQueueDetailContextDefaultValues: LaundryQueueDetailContextType = {
  isOpen: false,
  onOpen: () => {},
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
  const [isOpen, setIsOpen] = useState(false);

  const onClose = () => {
    setIsOpen(false);
    setData(null);
  };

  const onOpen = useCallback((payload: DataType | null) => {
    setIsOpen(true);
    setData(payload);
  }, []);

  const value: LaundryQueueDetailContextType = useMemo(
    () => ({
      isOpen,
      data,
      onOpen,
      onClose,
    }),
    [data, onOpen, isOpen]
  );

  return (
    <LaundryQueueDetailContext.Provider value={value}>
      {children}
    </LaundryQueueDetailContext.Provider>
  );
}
