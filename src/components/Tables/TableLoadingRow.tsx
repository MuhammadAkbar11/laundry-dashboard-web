import React from 'react';
import { Spinner } from 'react-bootstrap';

interface TableLoadingRowProps {
  isLoading: boolean;
  isError: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rows: any[];
  headerLength: number;
  emptyText?: string;
  errorText?: string;
  variant?: string;
}

function TableLoadingRow({
  isLoading,
  rows,
  headerLength,
  emptyText,
  errorText,
  isError,
  variant,
}: TableLoadingRowProps) {
  if (isLoading) {
    return (
      <tr>
        <td colSpan={headerLength} className="text-center">
          <Spinner size="sm" animation="border" variant={variant} role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </td>
      </tr>
    );
  }

  if (rows && rows.length === 0) {
    return (
      <tr>
        <td colSpan={headerLength}>
          <p className="text-center mb-0">{emptyText}</p>
        </td>
      </tr>
    );
  }

  return isError ? (
    <tr>
      <td colSpan={headerLength}>
        <p className="text-center mb-0">{errorText}</p>
      </td>
    </tr>
  ) : null;
}

TableLoadingRow.defaultProps = {
  emptyText: 'Tidak ada data yang di temukan',
  errorText: 'Terjadi kesalahan saat memuat data',
  variant: 'primary',
};

export default TableLoadingRow;
