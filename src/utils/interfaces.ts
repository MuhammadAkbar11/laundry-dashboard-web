/* eslint-disable @typescript-eslint/no-explicit-any */
import { IUserAuth } from '@/services/authSevices';
import { FeatherIconsTypes, ThemeTypes } from './types';

export interface IPageProps {
  userAuth: IUserAuth;
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
