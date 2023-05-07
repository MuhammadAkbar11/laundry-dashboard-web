/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/prefer-default-export */
import { FilterFn } from '@tanstack/react-table';
import { rankItem } from '@tanstack/match-sorter-utils';
import { UNKNOWM_ERROR } from '@configs/varsConfig';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    name: error.response?.data?.name || UNKNOWM_ERROR,
    message: error.response?.data?.message || 'Something Went Wrong',
    statusCode: error.response?.data?.statusCode || 500,
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

export function uRupiah(value: number) {
  const result = value.toLocaleString('id', {
    style: 'currency',
    currency: 'IDR',
  });
  return result;
}

export function uDate(_date: string) {
  const date = new Date(_date);
  const weekdays = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const formattedDate = `${weekdays[date.getDay()]}, ${date.getDate()} ${
    months[date.getMonth()]
  } ${date.getFullYear()}`;
  return formattedDate;
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
