/* eslint-disable @typescript-eslint/no-explicit-any */
import FeatherIcon from '@components/Icons/FeatherIcon';
import React from 'react';
import { Dropdown, Spinner } from 'react-bootstrap';
import LQStatusBadge from '@components/Badges/LQStatusBadge';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateLaundryQueueStatusService } from '@services/laundryQueueService';
import useNotification from '@hooks/useNotification';

type Props = {
  value: string;
  laundryQueueId: string;
  fetchQueryKey: any[];
};

type CustomToggleProps = {
  children: React.ReactNode;
  onClick: (e: React.MouseEvent) => void;
};

const options = [
  { value: 'PENDING', label: 'Menunggu' },
  { value: 'ONHOLD', label: 'Proses' },
  { value: 'WASHED', label: 'Cuci' },
  { value: 'CANCELED', label: 'Batalkan' },
];

// eslint-disable-next-line react/display-name
const CustomToggle = React.forwardRef<HTMLAnchorElement, CustomToggleProps>(
  ({ children, onClick }, ref) => {
    return (
      <a
        href="#/"
        ref={ref}
        onClick={(e: React.MouseEvent) => {
          e.preventDefault();
          onClick(e);
        }}
      >
        {children}
      </a>
    );
  }
);

function FromUpdateLaundryQueueStatus({
  value,
  fetchQueryKey,
  laundryQueueId,
}: Props): JSX.Element {
  const notif = useNotification();

  const queryClient = useQueryClient();
  const mutation = useMutation(updateLaundryQueueStatusService, {
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: fetchQueryKey,
      });
    },
  });

  const onSelectHandler = (input: string) => {
    // onChange(event.target.value);
    mutation.mutate(
      {
        status: input,
        laundryQueueId,
      },
      {
        onSuccess(data) {
          notif.success(data?.message as string);
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError(error: any) {
          // eslint-disable-next-line no-console
          const errMessage = error?.message || 'Gagal memperbaharui status!';
          notif.danger(errMessage);
        },
      }
    );
  };

  return (
    <Dropdown>
      <Dropdown.Toggle
        as={CustomToggle}
        id="dropdown-status"
        disabled={mutation.isLoading}
      >
        <LQStatusBadge
          disabled={mutation.isLoading}
          value={value}
          endIcon={
            <FeatherIcon name="ChevronDown" size={12} className="ms-1" />
          }
        />
      </Dropdown.Toggle>

      <Dropdown.Menu align="end">
        <Dropdown.Header>Klik untuk ubah status</Dropdown.Header>
        {options
          .filter((opt) => {
            if (value !== 'PENDING') {
              return opt.value !== 'CANCELED';
            }
            return opt;
          })
          .map((option) => {
            return (
              <Dropdown.Item
                key={option.value}
                eventKey={option.value}
                active={value === option.value}
                onClick={() =>
                  value !== option.value && onSelectHandler(option.value)
                }
              >
                {option.label}
              </Dropdown.Item>
            );
          })}
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default FromUpdateLaundryQueueStatus;
