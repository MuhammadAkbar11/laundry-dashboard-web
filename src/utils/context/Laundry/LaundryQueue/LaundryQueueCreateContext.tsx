/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ICustomer } from '@/services/customerService';
import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useMemo,
  useCallback,
} from 'react';

type DataType = {
  customer: ICustomer | null;
  fetchQueryKey: any[];
  [key: string]: any;
};

type FormTypeType = 'existingCustomer' | 'newCustomer';

type LaundryQueueCreateContextType = {
  isLoading: boolean;
  isSuccess: boolean;
  data?: DataType | null;
  isOpenForm: boolean;
  formType: FormTypeType;
  error: any;
  onSetError: (error: any) => void;
  onSetLoading: (value: boolean) => void;
  onSetSuccess: (value: boolean) => void;
  onSetData: (data: DataType | null) => void;
  onSetFormType: (type: FormTypeType) => void;
  onOpenForm: (data: DataType | null) => void;
  onCloseForm: () => void;
};

const laundryQueueCreateContextDefaultValues: LaundryQueueCreateContextType = {
  isOpenForm: false,
  formType: 'existingCustomer',
  isLoading: false,
  isSuccess: false,
  error: null,
  onSetData: () => {},
  onSetFormType: () => {},
  onSetLoading: () => {},
  onSetSuccess: () => {},
  onSetError: () => {},
  onOpenForm: () => {},
  onCloseForm: () => {},
};

export const LaundryQueueCreateContext =
  createContext<LaundryQueueCreateContextType>(
    laundryQueueCreateContextDefaultValues
  );

export function useLaundryQueueCreateContext() {
  const context = useContext(LaundryQueueCreateContext);
  if (context === undefined) {
    throw new Error(
      'useLaundryQueueCreateContext must wrapper in the provider'
    );
  }

  return context;
}

type Props = {
  children: ReactNode;
};

export function LaundryQueueCreateProvider({ children }: Props) {
  const [error, setError] = useState(null);
  const [data, setData] = useState<DataType | null>(null);
  const [formType, setFormType] = useState<FormTypeType>('existingCustomer');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenForm, setIsForm] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const onSetError = (error: any) => {
    setError(error);
  };
  const onSetData = (data: any) => setData(data);
  const onSetLoading = (value: boolean) => setIsLoading(value);
  const onSetSuccess = (value: boolean) => setIsSuccess(value);
  const onSetFormType = (value: FormTypeType) => setFormType(value);

  const onCloseForm = () => {
    setIsForm(false);
    setData(null);
    setFormType('existingCustomer');
  };

  const onOpenForm = useCallback((data: DataType | null) => {
    setIsSuccess(false);
    setIsLoading(false);
    setIsForm(true);
    setData(data);
  }, []);

  const value: LaundryQueueCreateContextType = useMemo(
    () => ({
      formType,
      isOpenForm,
      data,
      error,
      isLoading,
      isSuccess,
      onSetLoading,
      onSetData,
      onSetSuccess,
      onSetError,
      onOpenForm,
      onCloseForm,
      onSetFormType,
    }),
    [error, data, isLoading, isSuccess, isOpenForm, onOpenForm, formType]
  );

  return (
    <LaundryQueueCreateContext.Provider value={value}>
      {children}
    </LaundryQueueCreateContext.Provider>
  );
}
