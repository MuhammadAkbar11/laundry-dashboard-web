/* eslint-disable no-console */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/prefer-default-export */
// eslint-disable @typescript-eslint/no-explicit-any
import { FilterFn } from '@tanstack/react-table';
import { rankItem } from '@tanstack/match-sorter-utils';
import { UNKNOWM_ERROR } from '@configs/varsConfig';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Faker } from '@faker-js/faker';
import { faker } from '@faker-js/faker/locale/id_ID';

export const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // Store the itemRank info
  addMeta({
    itemRank,
  });

  // Return if the item should be filtered in/out
  return itemRank.passed;
};

export function uIsNotEmptyObject(obj: Record<string, unknown>): boolean {
  return obj ? Object.keys(obj).length !== 0 : false;
}

// Error
export function uTranformAxiosError(error: any) {
  return {
    name: error.response?.data?.name || error?.name || UNKNOWM_ERROR,
    message:
      error.response?.data?.message || error?.message || 'Something Went Wrong',
    statusCode:
      error.response?.data?.statusCode || error.response?.status || 500,
    ...error.response?.data?.data,
  };
}

export function uQueriesToString<T extends Record<string, any>>(queries: T) {
  Object.keys(queries).forEach((key) => {
    if (queries[key] === null) delete queries[key];
    if (queries[key] === undefined) delete queries[key];
    if (typeof queries[key] === 'string' && queries[key].trim() === '')
      delete queries[key];
  });

  return Object.keys(queries)
    .map((key) => {
      return `${key}=${queries[key]}`;
    })
    .join('&');
}

export function uDelayAsync(ms: number) {
  // eslint-disable-next-line no-promise-executor-return
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function uRupiah(value: number) {
  const result = value.toLocaleString('id', {
    style: 'currency',
    currency: 'IDR',
  });
  return result;
}

export function uDate(_date?: string) {
  if (_date) {
    const date = new Date(_date);
    return format(date, 'EEEE, dd/MM/yyyy hh:mm BBBB', { locale: id });
  }
  return null;
}

export function uHandleDuplicates<T extends Record<string, any>>(
  arr: T[],
  compareFn: (a: T, b: T) => boolean
): T[] {
  // Create a new Map object to store the unique objects.
  const uniqueObjects = new Map();
  for (const obj of arr) {
    let isUnique = true;

    uniqueObjects.forEach((value, _key) => {
      if (compareFn(obj, value)) {
        isUnique = false;
      }
    });

    if (isUnique) {
      uniqueObjects.set(obj, obj);
    }
  }

  return Array.from(uniqueObjects.values());
}

export function uNotAuthRedirect(destination = '/login') {
  return {
    redirect: {
      destination,
      permanent: false,
    },
  };
}

export function uIsAuthRedirect(destination = '/') {
  return {
    redirect: {
      destination,
      permanent: false,
    },
  };
}

export function uConvertKeysToCamelCase(obj: any) {
  const newObj: any = {};
  for (const key in obj) {
    const newKey = key.replace(/_([a-z])/g, (match) => match[1].toUpperCase());
    newObj[newKey] = obj[key];
  }
  return newObj;
}

export function uConvertNestedObjKeysToCamelCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map((v) => {
      if (typeof v === 'object') {
        return uConvertNestedObjKeysToCamelCase(v);
      }
      return v;
    });
  }
  return Object.keys(obj).reduce((result, key) => {
    const value = obj[key];
    const newKey = key.replace(/_([a-z])/g, (m, p1) => p1.toUpperCase());
    let newValue;

    if (value && typeof value === 'object') {
      newValue = uConvertNestedObjKeysToCamelCase(value);
    } else {
      newValue = value;
    }

    return { ...result, [newKey]: newValue };
  }, {});
}

export function runInDev(callback: () => void) {
  if (process.env.NODE_ENV === 'development') {
    console.log('info - Running in development mode...');
    callback();
    console.log('info - Development mode execution completed.');
  }
}

export async function runInDevAsync<T>(
  callback: () => Promise<T>
): Promise<T | undefined> {
  if (process.env.NODE_ENV === 'development') {
    console.log('Running in development mode...');
    try {
      const result = await callback();
      console.log('Development mode execution completed.');
      return result;
    } catch (error) {
      console.error('Error occurred during development mode execution:', error);
    }
  }

  return undefined;
}

export function runFakerJsInDev<T>(
  callback: (fk: Faker) => void
): T | void | null {
  if (process.env.NODE_ENV === 'development') {
    return callback(faker);
  }

  return null;
}
