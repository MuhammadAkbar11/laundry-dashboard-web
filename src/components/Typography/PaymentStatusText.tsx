import clsx from 'classnames';
import { LAUNDRY_PAYMENT_STATUS } from '@configs/varsConfig';
import { LaundryQueuePaymentStatusType } from '@types';

type PaymentStatusTextProps = {
  value: string;
  colored: boolean;
  className?: string;
};

function PaymentStatusText({
  className,
  value,
  colored,
}: PaymentStatusTextProps): JSX.Element {
  const clsNm = clsx('d-inline-block text-capitalize ', className, {
    'text-success': value?.trim() === 'FINISHED' && colored === true,
    'text-warning': value?.trim() === 'PENDING' && colored === true,
    'text-danger': value?.trim() === 'REJECTED' && colored === true,
    'text-info': value?.trim() === 'PROCESSED' && colored === true,
    'text-dark': !colored,
  });

  return (
    <div className={clsNm}>
      {
        LAUNDRY_PAYMENT_STATUS[
          (value as LaundryQueuePaymentStatusType) || 'PENDING'
        ]
      }
    </div>
  );
}

PaymentStatusText.defaultProps = {
  className: '',
};

export default PaymentStatusText;
