/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-explicit-any */
// import { ICustomer } from '@/services/customerService';
import { ICustomer } from '@/services/customerService';
import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useMemo,
} from 'react';

interface ICustomerPageFormActionOffCanvas {
  open: boolean;
  formType: 'initial' | 'create' | 'update';
  data?: { customer?: ICustomer; fetchQueryKey: any[] } | null;
}

interface ICustomerPageContextType {
  formActionOffCanvas: ICustomerPageFormActionOffCanvas;
  error: any;
  onSetError?: (error: any) => void;
  onToggleFormActionOffCanvas: (
    options: ICustomerPageFormActionOffCanvas
  ) => void;
}

const customerPageContextDefaultValues: ICustomerPageContextType = {
  formActionOffCanvas: { open: false, formType: 'create' },
  onToggleFormActionOffCanvas: () => {},
  error: null,
};

export const CustomerPageContext = createContext<ICustomerPageContextType>(
  customerPageContextDefaultValues
);

export function useCustomerPageContext() {
  const context = useContext(CustomerPageContext);
  if (context === undefined) {
    throw new Error('useCustomerPageContext must wrapper in the provider');
  }

  return context;
}

type Props = {
  children: ReactNode;
};

export function CustomerPageProvider({ children }: Props) {
  const [formActionOffCanvas, setFormActionOffCanvas] =
    React.useState<ICustomerPageFormActionOffCanvas>({
      open: false,
      formType: 'create',
    });

  const [error, setError] = useState(null);

  const onToggleFormActionOffCanvas = (
    options: ICustomerPageFormActionOffCanvas
  ) => {
    setFormActionOffCanvas({
      open: options.open,
      formType: options.formType,
      data: options?.data,
    });
  };

  const onSetError = (error: any) => {
    setError(error);
  };

  const values: ICustomerPageContextType = useMemo(
    () => ({
      formActionOffCanvas,
      error,
      onSetError,
      onToggleFormActionOffCanvas,
    }),
    [error, formActionOffCanvas]
  );

  return (
    <CustomerPageContext.Provider value={values}>
      {children}
    </CustomerPageContext.Provider>
  );
}
