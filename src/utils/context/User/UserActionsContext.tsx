/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-explicit-any */
// import { IUser } from '@/services/userService';
import { IUser } from '@interfaces';
import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useMemo,
} from 'react';

type FormActionType = 'initial' | 'create' | 'update';

interface IData {
  user: IUser | null;
  fetchQueryKey: any[];
}

interface IUserActionsContextType {
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

const initialContext: IUserActionsContextType = {
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

export const UserActionsContext =
  createContext<IUserActionsContextType>(initialContext);

export function useUserActionsContext() {
  const context = useContext(UserActionsContext);
  if (context === undefined) {
    throw new Error('useUserActionsContext must wrapper in the provider');
  }

  return context;
}

type Props = {
  children: ReactNode;
};

export function UserActionsProvider({ children }: Props) {
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

  const ctxValues: IUserActionsContextType = useMemo(
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
    <UserActionsContext.Provider value={ctxValues}>
      {children}
    </UserActionsContext.Provider>
  );
}
