/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useMemo,
} from 'react';

interface IData {
  customerId: string;
  fetchQueryKey: any[];
  [key: string]: any;
}

interface ICustomerDeleteContext {
  showModal: boolean;
  isLoading: boolean;
  isSuccess: boolean;
  data?: IData | null;
  error: any;
  onSetError: (error: any) => void;
  onSetLoading: (value: boolean) => void;
  onSetSuccess: (value: boolean) => void;
  // onToggleModal: (value: boolean) => void;
  onOpenModal: (data: IData | null) => void;
  onCloseModal: () => void;
  onReset?: () => void;
}

const customerDeleteContextDefaultValues: ICustomerDeleteContext = {
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

export const CustomerDeleteContext = createContext<ICustomerDeleteContext>(
  customerDeleteContextDefaultValues
);

export function useCustomerDeleteContext() {
  const context = useContext(CustomerDeleteContext);
  if (context === undefined) {
    throw new Error('useCustomerDeleteContext must wrapper in the provider');
  }

  return context;
}

type Props = {
  children: ReactNode;
};

export function CustomerDeleteProvider({ children }: Props) {
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

  // const onReset = () => {
  //   setData(null);
  //   setModal(false);
  //   setIsLoading(false);
  //   setIsSuccess(false);
  // };

  const value: ICustomerDeleteContext = useMemo(
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
    <CustomerDeleteContext.Provider value={value}>
      {children}
    </CustomerDeleteContext.Provider>
  );
}
