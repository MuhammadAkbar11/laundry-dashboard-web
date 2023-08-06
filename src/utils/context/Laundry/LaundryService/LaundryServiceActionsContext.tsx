/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-explicit-any */
// import { ILaundryService } from '@/services/laundryServiceService';
import { ILaundryService } from '@interfaces';
import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useMemo,
} from 'react';

type FormActionType = 'initial' | 'create' | 'update';

interface IData {
  laundryService: ILaundryService | null;
  fetchQueryKey: any[];
}

interface ILaundryServiceActionsContextType {
  isLoading: boolean;
  isSuccess: boolean;
  isOpenForm: boolean;
  formType: FormActionType;
  data?: IData | null;
  error: any;
  onSetError: (error: any) => void;
  onSetLoading: (value: boolean) => void;
  onSetSuccess: (value: boolean) => void;
  onOpenForm: (payloadFormType: FormActionType, data: IData | null) => void;
  onCloseForm: () => void;
}

const initialContext: ILaundryServiceActionsContextType = {
  isLoading: false,
  isSuccess: false,
  isOpenForm: false,
  formType: 'initial',
  data: null,
  error: null,
  onSetError: () => {},
  onSetLoading: () => {},
  onSetSuccess: () => {},
  onOpenForm: () => {},
  onCloseForm: () => {},
};

export const LaundryServiceActionsContext =
  createContext<ILaundryServiceActionsContextType>(initialContext);

export function useLaundryServiceActionsContext() {
  const context = useContext(LaundryServiceActionsContext);
  if (context === undefined) {
    throw new Error(
      'useLaundryServiceActionsContext must wrapper in the provider'
    );
  }

  return context;
}

type Props = {
  children: ReactNode;
};

export function LaundryServiceActionsProvider({ children }: Props) {
  // Define your state variables here
  const [isLoading, setIsLoading] = useState(initialContext.isLoading);
  const [isSuccess, setIsSuccess] = useState(initialContext.isSuccess);
  const [isOpenForm, setIsOpenForm] = useState(initialContext.isOpenForm);
  const [formType, setFormType] = useState<FormActionType>(
    initialContext.formType
  );
  const [data, setData] = useState<IData | null>(null);
  const [error, setError] = useState<any>(initialContext.error);

  const onSetError = (payload: any) => {
    setError(payload);
  };

  const onSetLoading = (value: boolean) => {
    setIsLoading(value);
  };

  const onSetSuccess = (value: boolean) => {
    setIsSuccess(value);
  };

  const onOpenForm = (
    payloadFormType: FormActionType,
    payload?: IData | null
  ) => {
    setIsLoading(false);
    setIsOpenForm(true);
    setData(payload as IData);
    setFormType(payloadFormType);
  };

  const onCloseForm = () => {
    setIsOpenForm(false);

    setData(null);
    setFormType('initial');
  };

  const ctxValues: ILaundryServiceActionsContextType = useMemo(
    () => ({
      isLoading,
      isSuccess,
      isOpenForm,
      formType,
      data,
      error,
      onSetError,
      onSetLoading,
      onSetSuccess,
      onOpenForm,
      onCloseForm,
    }),
    [isLoading, isSuccess, isOpenForm, formType, data, error]
  );

  return (
    <LaundryServiceActionsContext.Provider value={ctxValues}>
      {children}
    </LaundryServiceActionsContext.Provider>
  );
}
