import themeConfigs from '@configs/themeConfigs';
import * as RFIcon from 'react-feather';

export type FeatherIconsTypes = keyof typeof RFIcon;
export type ThemeTypes = keyof typeof themeConfigs;

export type NotificationVariantTypes =
  | 'primary'
  | 'success'
  | 'danger'
  | 'info'
  | 'warning';

export type BootstrapBreakpointsTypes =
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | 'xxl';

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
