/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  FeatherIconsTypes,
  LaundryQueuePaymentStatusType,
  LaundryQueueStatusType,
  LaundryRoomStatusTypes,
  LaundryServiceUnitTypes,
  PaymentMethodTypes,
  ThemeTypes,
  UserRoleTypes,
  UserStatusTypes,
} from './types';

export interface INavigationSubItems {
  name: string;
  href: string;
  badge?: string;
  bagdeColor?: ThemeTypes;
  disabled?: boolean;
  permissions: string[];
}

export interface INavigationItem {
  name: string;
  icon: FeatherIconsTypes;
  href?: string;
  disabled?: boolean;
  badge?: string;
  bagdeColor?: ThemeTypes;
  permissions?: string[];
  navSubItems?: INavigationSubItems[];
}

export interface INavigation {
  [key: string]: {
    title: string;
    navItems: INavigationItem[];
  };
}

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

export interface ISettingItem {
  settingId: string;
  name: string;
  description: string;
  value: string;
}

export interface ISetting {
  name: ISettingItem;
  alamat: ISettingItem;
  kelurahan: ISettingItem;
  kecamatan: ISettingItem;
  kabupaten: ISettingItem;
  provinsi: ISettingItem;
  kodepos: ISettingItem;
  [key: string]: any;
}

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

export interface IMember {
  avatar: string;
  createdAt: string;
  customerId: string;
  email: string;
  memberId: string;
  password: string;
  status: string;
  updatedAt: string;
  username: string;
}

export interface IMemberAuth extends IMember {
  session: string;
}

export interface IMemberProfile extends IMember {
  customer: Omit<ICustomer, '_count'>;
  isValidProfile: boolean;
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

export interface IUser {
  userId: string;
  email: string;
  name: string;
  avatar: string;
  password: string;
  role: UserRoleTypes;
  status: UserStatusTypes;
  createdAt: Date;
  updatedAt: Date;
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
  deliveryAt: string | null;
  deliveryType: string;
  note: string;
  deliveryAddress: string;
  pickupAt: string;
  customer?: Omit<ICustomer, 'customerLevel' | '_count'> & {
    customerLevel?: ICustomerLevel;
  };
  laundryRoom?: {
    laundryRoomId: string;
    total: number;
    status: string;
    createdAt: string;
    updatedAt: string;
    laundryQueueId: string;
  };
  _count: { laundries: number };
}

export interface IPayment {
  paymentId: string;
  invoice: string;
  price: string;
  discount: number;
  paid: string;
  cashback: string;
  paymentMethod: PaymentMethodTypes;
  createdAt: string;
  updatedAt: string;
  userId: string;
  laundryQueueId: string;
  totalPrice: string;
  proof?: string;
  totalLaundry: number;
  laundryQueue: Omit<ILaundryQueue, 'laundryRooms' | '_count'>;
  user: IUser;
}

export interface ILaundryRoom {
  laundryRoomId: string;
  total: number;
  status: LaundryRoomStatusTypes;
  createdAt: string;
  updatedAt: string;
  laundryQueueId: string;
  laundryQueue: Omit<ILaundryQueue, 'laundryRoom' | '_count'> & {
    payment?: Omit<IPayment, 'laundryQueue' | 'user'>;
  };
}

export interface IListLaundryRoom extends Omit<ILaundryRoom, 'laundryQueue'> {
  laundryQueue: Omit<ILaundryQueue, 'laundryRoom'>;
}

export interface IInvoice extends Omit<IPayment, 'laundryQueue'> {
  laundryQueue: Omit<ILaundryQueue, '_count'> & { laundries: ILaundryItem[] };
}

export interface IReportTrx {
  month: string;
  time: string;
  invoice: string;
  description: string;
  type: 'IN' | 'OUT';
  amount: string;
}

export interface IReportTrxYears {
  value: number;
  income: number;
  expense: number;
  incomeTotal: number;
  expenseTotal: number;
}

export interface IReportCashFlow {
  balance: string;
  cashflowId: string;
  cashflowInvoice: string;
  cashflowType: string;
  createdAt: string;
  description: string;
  total: string;
  updatedAt: string;
}

export interface IReportTrxMonth extends IReportTrxYears {
  key: string;
}

export interface IReportTrxYearAndMonth {
  value: string;
  day: string;
  month: string;
  year: string;
  income: number;
  expense: number;
  incomeTotal: number;
  expenseTotal: number;
}

export interface IPageProps {
  userAuth: IUserAuth;
}

export interface IMemberPageProps {
  memberAuth: IMemberAuth;
}
