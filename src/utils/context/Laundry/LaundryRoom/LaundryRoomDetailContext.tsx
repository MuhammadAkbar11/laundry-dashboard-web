/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ILaundryRoom } from '@interfaces';
import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useMemo,
  // useCallback,
} from 'react';

type DataType = {
  // laundryRoom: ILaundryRoom | null;
  fetchQueryKey: any[];
  [key: string]: any;
};

type LaundryRoomDetailContextType = {
  data?: DataType | null;
  laundryRoom: ILaundryRoom | null;
  isOpen: boolean;
  isLoading: boolean;

  onOpen: (data: DataType | null) => void;
  onSetLaundryRoom: (data: ILaundryRoom) => void;
  onSetLoading: (value: boolean) => void;
  onClose: () => void;
};

const laundryRoomDetailContextDefaultValues: LaundryRoomDetailContextType = {
  laundryRoom: null,
  isOpen: false,
  isLoading: false,

  onOpen: () => {},
  onClose: () => {},
  onSetLaundryRoom: () => {},
  onSetLoading: () => {},
};

export const LaundryRoomDetailContext =
  createContext<LaundryRoomDetailContextType>(
    laundryRoomDetailContextDefaultValues
  );

export function useLaundryRoomDetailContext() {
  const context = useContext(LaundryRoomDetailContext);
  if (context === undefined) {
    throw new Error('useLaundryRoomDetailContext must wrapper in the provider');
  }

  return context;
}

type Props = {
  children: ReactNode;
};

export function LaundryRoomDetailProvider({ children }: Props) {
  const [data] = useState<DataType | null>(null);
  const [laundryRoom, setLaundryRoom] = useState<ILaundryRoom | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onSetLoading = (value: boolean) => setIsLoading(value);

  const onClose = () => {
    setIsOpen(false);
  };

  const onOpen = () => {
    setIsOpen(false);
  };
  const onSetLaundryRoom = (payload: ILaundryRoom) => {
    setLaundryRoom(payload);
  };

  const value: LaundryRoomDetailContextType = useMemo(
    () => ({
      isLoading,
      isOpen,
      data,
      laundryRoom,
      onOpen,
      onClose,
      onSetLaundryRoom,
      onSetLoading,
    }),
    [data, isOpen, laundryRoom, isLoading]
  );

  return (
    <LaundryRoomDetailContext.Provider value={value}>
      {children}
    </LaundryRoomDetailContext.Provider>
  );
}
