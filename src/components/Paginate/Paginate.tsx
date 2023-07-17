import React from 'react';
import clsx from 'classnames';
import { Pagination } from 'react-bootstrap';
import FeatherIcon from '@components/Icons/FeatherIcon';
import PaginateNumbers from './PaginateNumbers';

type Props = {
  isHasNextPage: boolean;
  isHasPrevPage: boolean;
  onNextPage: () => void;
  onPrevPage: () => void;
  onSetPage: (page: number) => void;
  totalPages: number;
  activePage: number;
  loading: boolean;
  className?: string;
};

function Paginate({
  isHasNextPage,
  isHasPrevPage,
  onNextPage,
  onPrevPage,
  onSetPage,
  totalPages,
  activePage,
  loading,
  className,
}: Props) {
  return (
    <Pagination className={clsx('align-self-center my-auto', className)}>
      <Pagination.Prev
        onClick={() => onPrevPage()}
        className="d-flex "
        disabled={!isHasPrevPage}
      >
        <span className="d-flex align-items-center  h-100 ">
          <FeatherIcon size={14} name="ChevronLeft" />
        </span>
      </Pagination.Prev>
      {totalPages > 0 ? (
        <PaginateNumbers
          totalPages={totalPages}
          activePage={activePage}
          onSetPage={onSetPage}
          loading={loading}
        />
      ) : null}

      <Pagination.Next
        onClick={() => onNextPage()}
        className="d-flex "
        disabled={!isHasNextPage}
      >
        <span className="d-flex align-items-center  h-100 ">
          <FeatherIcon size={14} name="ChevronRight" />
        </span>
      </Pagination.Next>
    </Pagination>
  );
}

Paginate.defaultProps = {
  className: '',
};

export default Paginate;
