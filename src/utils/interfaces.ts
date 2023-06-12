/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  FeatherIconsTypes,
  LaundryQueuePaymentStatusType,
  LaundryQueueStatusType,
  LaundryRoomStatusTypes,
  LaundryServiceUnitTypes,
  ThemeTypes,
} from './types';

export interface IAxiosErrorResult {
  name: string;
  message: string;
  statusCode: number;
  [key: string]: any;
}

export interface INotification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  icon?: FeatherIconsTypes;
  iconColor?: ThemeTypes;
}

export interface IProject {
  name: string;
  startDate: string;
  endDate: string;
  status: 'In progress' | 'Done' | 'Cancelled';
  assignedTo: string;
}

export interface IMessage {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  image?: string;
}

export interface IPerson {
  [x: string]: any;
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  visits: number;
  progress: number;
  status: 'relationship' | 'complicated' | 'single';
  createdAt: Date;
}

export interface IQueriesOptions {
  _limit: number;
  _page: number;
  _search?: string;
  _sortBy?: 'asc' | 'desc' | null;
  _orderBy?: string;
}

export interface IPaginationSorting {
  id: string;
  desc: boolean;
}

export interface IPaginationOptions {
  pageIndex: number;
  pageSize: number;
  // sorting,
  searchTerm: string;
  sorting?: IPaginationSorting[];
}

export interface IServiceWithPaginateReturn<T> {
  rows: T[];
  entriesCount: number;
  pageCount: number;
}

export interface IPaginateDataApiResponse<T> {
  rows: T[];
  totalEntries: number;
  pageCount: number;
}

// API Data Interface

export interface ICustomerLevel {
  customerLevelId: string;
  name: string;
  point: bigint;
  discount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ICustomer {
  customerId: string;
  name: string;
  address: string;
  phone: string;
  customerLevelId: string;
  point: number;
  createdAt: string;
  updatedAt: string;
  customerLevel: ICustomerLevel;
  _count?: {
    laundryQueues: number;
  };
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IUserAuth {
  userId: string;
  email: string;
  name: string;
  avatar: string;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  session: string;
}

export interface ILaundryService {
  serviceId: string;
  name: string;
  description: string;
  unit: LaundryServiceUnitTypes;
  price: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ILaundryItem {
  laundryId: string;
  price: string;
  quantity: number;
  totalPrice: string;
  createdAt: string;
  updatedAt: string;
  laundryQueueId: string;
  note: string;
  historyServiceId: string;
  serviceId: string;
  historyService: ILaundryService;
}

export interface ILaundryQueue {
  laundryQueueId: string;
  queuePaymentStatus: LaundryQueuePaymentStatusType;
  status: LaundryQueueStatusType;
  finishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  customerId: string;
  userId: string;
  deliveryAt: string | null;
  deliveryType: string;
  note: string;
  customer: Omit<ICustomer, 'customerLevel' | '_count'>;
  user: Omit<IUserAuth, 'session'>;
  laundryRooms?: {
    laundryRoomId: string;
    total: number;
    status: string;
    createdAt: string;
    updatedAt: string;
    userId: string;
    laundryQueueId: string;
  };
  _count: { laundries: number };
}

export interface ILaundryRoom {
  laundryRoomId: string;
  total: number;
  status: LaundryRoomStatusTypes;
  createdAt: string;
  updatedAt: string;
  userId: string;
  laundryQueueId: string;
  user: Omit<IUserAuth, 'session'>;
  laundryQueue: Omit<ILaundryQueue, 'laundryRooms' | '_count' | 'user'>;
}

export interface IPageProps {
  userAuth: IUserAuth;
}
