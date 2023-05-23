/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useMemo,
} from 'react';

type BlankContextType = {
  isLoading: boolean;
  isSuccess: boolean;
  data?: any;
  error: any;
  onSetError: (error: any) => void;
  onSetLoading: (value: boolean) => void;
  onSetSuccess: (value: boolean) => void;
  onSetData: (data: any) => void;
  onReset: () => void;
};

const blankContextDefaultValues: BlankContextType = {
  isLoading: false,
  isSuccess: false,
  error: null,
  onSetData: () => {},
  onSetLoading: () => {},
  onSetSuccess: () => {},
  onSetError: () => {},
  onReset: () => {},
};

export const BlankContext = createContext<BlankContextType>(
  blankContextDefaultValues
);

export function useBlankContext() {
  const context = useContext(BlankContext);
  if (context === undefined) {
    throw new Error('useBlankContext must wrapper in the provider');
  }

  return context;
}

type Props = {
  children: ReactNode;
};

export function BlankProvider({ children }: Props) {
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const onSetError = (error: any) => {
    setError(error);
  };
  const onSetData = (data: any) => setData(data);
  const onSetLoading = (value: boolean) => setIsLoading(value);
  const onSetSuccess = (value: boolean) => setIsSuccess(value);
  const onReset = () => {
    setData(null);
    setIsLoading(false);
    setIsSuccess(false);
  };

  const value: BlankContextType = useMemo(
    () => ({
      data,
      error,
      isLoading,
      isSuccess,
      onSetLoading,
      onSetData,
      onSetSuccess,
      onSetError,
      onReset,
    }),
    [error, data, isLoading, isSuccess]
  );

  return (
    <BlankContext.Provider value={value}>{children}</BlankContext.Provider>
  );
}
