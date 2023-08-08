import React from 'react';
import Link from 'next/link';
import { Form } from 'react-bootstrap';
import BoxButton from '@components/Buttons/BoxButton';
import { ILaundryRoom } from '@interfaces';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateStatusFinishedService } from '@services/laundryRoomService';
import { useLaundryRoomDetailContext } from '@utils/context/Laundry/LaundryRoom/LaundryRoomDetailContext';
import useNotification from '@hooks/useNotification';

interface Props {
  laundriesLength: number;
  laundryRoom: ILaundryRoom;
  laundryRoomQueryKey: unknown[];
}

function FormFinishedLaundryRoom({
  laundriesLength,
  laundryRoom,
  laundryRoomQueryKey,
}: Props) {
  const laundryRoomDetailCtx = useLaundryRoomDetailContext();

  const notif = useNotification();

  const queryClient = useQueryClient();
  const mutation = useMutation(updateStatusFinishedService, {
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: laundryRoomQueryKey,
      });
    },
  });

  const onSubmitHandler = () => {
    laundryRoomDetailCtx.onSetLoading(true);

    mutation.mutate(
      {
        laundryRoomId: laundryRoom?.laundryRoomId,
        laundryQueueId: laundryRoom?.laundryQueueId,
      },
      {
        onSuccess(data) {
          notif.success(data?.message as string, { duration: 10000 });
          laundryRoomDetailCtx.onSetLoading(false);
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError(error: any) {
          laundryRoomDetailCtx.onSetLoading(false);
          // eslint-disable-next-line no-console
          const errMessage = error?.message || 'Gagal memperbaharui data!';
          notif.danger(errMessage);
        },
      }
    );
  };

  const hidePayBtn =
    laundryRoomDetailCtx.isLoading ||
    laundriesLength === 0 ||
    laundryRoom?.status !== 'FINISHED' ||
    laundryRoom?.laundryQueue?.queuePaymentStatus === 'FINISHED';

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmitHandler();
      }}
    >
      <div className="d-flex gap-2">
        {hidePayBtn ? (
          <BoxButton disabled variant="success" icon="DollarSign">
            Bayar
          </BoxButton>
        ) : (
          <Link
            href={`/admin/laundry/bayar/${laundryRoom?.laundryRoomId}`}
            legacyBehavior
            passHref
          >
            <BoxButton variant="success" icon="DollarSign">
              Bayar
            </BoxButton>
          </Link>
        )}
        <BoxButton
          disabled={
            laundriesLength === 0 ||
            laundryRoom.status === 'FINISHED' ||
            laundryRoomDetailCtx.isLoading
          }
          variant="success"
          type="submit"
          isLoading={mutation.isLoading}
          icon="CheckCircle"
        >
          Set selesai
        </BoxButton>
      </div>
    </Form>
  );
}

export default FormFinishedLaundryRoom;
