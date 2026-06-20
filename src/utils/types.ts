import themeConfigs from '@configs/themeConfigs';
import * as Lucide from 'lucide-react';

export type LucideIconTypes = keyof typeof Lucide;
export type ThemeTypes = keyof typeof themeConfigs;

export type NotificationVariantTypes =
  | 'primary'
  | 'success'
  | 'danger'
  | 'info'
  | 'warning';

export type BootstrapBreakpointsTypes =
  | 'xs'
  | 'sm-max'
  | 'sm-min'
  | 'md-max'
  | 'md-min'
  | 'lg-max'
  | 'lg-min'
  | 'xl-max'
  | 'xl-min'
  | 'xxl-max'
  | 'xxl-min';

export type LaundryQueuePaymentStatusType =
  | 'PENDING'
  | 'PROCESSED'
  | 'REJECTED'
  | 'FINISHED';
export type LaundryQueueStatusType =
  | 'PENDING'
  | 'FINISHED'
  | 'CANCELED'
  | 'ONHOLD'
  | 'WASHED';
export type LaundryServiceUnitTypes = 'KG' | 'PTNG';
export type LaundryRoomStatusTypes = 'READY' | 'WASHED' | 'FINISHED';
export type UserRoleTypes = 'ADMIN' | 'CASHIER' | 'OFFICER';
export type UserStatusTypes = 'PENDING' | 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
export type PaymentMethodTypes = 'BANK_TRANSFER' | 'CASH';

export type AuditActionTypes =
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'LOGIN'
  | 'LOGOUT'
  | 'PASSWORD_RESET'
  | 'STATUS_CHANGE';

export type AuditEntityTypeTypes =
  | 'USER'
  | 'MEMBER'
  | 'ORDER'
  | 'PAYMENT'
  | 'EXPENSE'
  | 'NOTIFICATION_TEMPLATE'
  | 'SETTINGS';
