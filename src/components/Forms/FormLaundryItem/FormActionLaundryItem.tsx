/* eslint-disable no-console */
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Form, Table } from 'react-bootstrap';
import {
  CreateLaundryItemInputTypes,
  createLaundryItemSchema,
} from '@utils/schema/laundryItemSchema';
import { ILaundryItem } from '@interfaces';
import { uRupiah } from '@utils/utils';
import { useLaundryRoomDetailContext } from '@utils/context/Laundry/LaundryRoom/LaundryRoomDetailContext';
import BoxButton from '@components/Buttons/BoxButton';
import useGetLaundryServices from '@hooks/useGetLaundryServices';
import TableRowInfo from '@components/Utils/TableRowInfo';
import { postOrPutLaundryItemService } from '@services/laundryItemService';
import useNotification from '@hooks/useNotification';

type Props = {
  laundryQueueId: string;
  onCloseForm: () => void;
  type: 'create' | 'update';
  laundryItem: ILaundryItem | null;
};

function FormActionLaundryItem({
  laundryQueueId,
  onCloseForm,
  type,
  laundryItem,
}: Props) {
  const laundryRoomCtx = useLaundryRoomDetailContext();

  const laundryServices = useGetLaundryServices('admin');
  const laundryServicesLoading = laundryServices.isLoading;
  const notif = useNotification();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors: formErrors },
  } = useForm<CreateLaundryItemInputTypes>({
    resolver: zodResolver(createLaundryItemSchema),
  });

  React.useEffect(() => {
    if (type === 'update' && laundryItem && !laundryServicesLoading) {
      setValue('note', laundryItem?.note || '');
      setValue('qty', laundryItem?.quantity);
      setValue('serviceId', laundryItem?.historyService?.serviceId);
    }
  }, [laundryItem, type, setValue, laundryServicesLoading]);

  const queryClient = useQueryClient();
  const mutation = useMutation(postOrPutLaundryItemService, {
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['laundriesData', { laundryQueueId }],
      });
      queryClient.invalidateQueries({
        queryKey: [
          'laundryRoomDetail',
          {
            laundryRoomId: laundryRoomCtx?.laundryRoom?.laundryRoomId,
          },
        ],
      });
    },
  });

  const onSubmit = handleSubmit(async (inputs: CreateLaundryItemInputTypes) => {
    laundryRoomCtx.onSetLoading(true);
    mutation.mutate(
      {
        ...inputs,
        laundryQueueId,
        laundryId: laundryItem?.laundryId,
        type,
      },
      {
        onSuccess(data) {
          laundryRoomCtx.onSetLoading(false);
          notif.success(data?.message as string);
          onCloseForm();
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError(error: any) {
          laundryRoomCtx.onSetLoading(false);

          // eslint-disable-next-line no-console
          const errMessage = error?.message || 'Gagal menambahkan data!';
          notif.danger(errMessage);
          onCloseForm();
        },
      }
    );
  });

  const serviceValue = watch('serviceId');
  const qtyValue = watch('qty');

  const selectedLaundryService = React.useMemo(() => {
    if (laundryServices?.data) {
      return serviceValue
        ? laundryServices?.data?.find((s) => s.serviceId === serviceValue)
        : null;
    }
    return null;
  }, [laundryServices, serviceValue]);

  const calculatedTotalPrice =
    +qtyValue >= 0
      ? uRupiah(Number(selectedLaundryService?.price) * +qtyValue || 0)
      : 'Rp 0,00';

  return (
    <Form
      onSubmit={onSubmit}
      className="h-100 d-flex flex-column justify-content-between "
    >
      <div>
        <Form.Group className="mb-3">
          <Form.Label>Antrian :</Form.Label>
          <Form.Control type="text" value={laundryQueueId} disabled readOnly />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Jenis Layanan :</Form.Label>
          <Form.Control
            as="select"
            size="lg"
            isInvalid={!!formErrors?.serviceId}
            disabled={laundryServices.isLoading}
            defaultValue={
              type === 'update' ? laundryItem?.historyService?.serviceId : ''
            }
            {...register('serviceId')}
          >
            <option value="" disabled>
              -- Pilih Layanan --
            </option>
            {laundryServices?.data
              ? laundryServices?.data.map((srv) => (
                  <option key={srv.serviceId} value={srv.serviceId}>
                    {srv.name}
                  </option>
                ))
              : null}
          </Form.Control>
          {formErrors?.serviceId?.message ? (
            <Form.Control.Feedback type="invalid" className=" pt-1">
              {formErrors?.serviceId?.message}
            </Form.Control.Feedback>
          ) : null}
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Quantity:</Form.Label>
          <Form.Control
            type="number"
            size="lg"
            isInvalid={!!formErrors?.qty}
            {...register('qty', { valueAsNumber: true })}
          />
          {formErrors?.qty?.message ? (
            <Form.Control.Feedback type="invalid" className=" pt-1">
              {formErrors?.qty?.message}
            </Form.Control.Feedback>
          ) : null}
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="note">Catatan</Form.Label>
          <Form.Control
            size="lg"
            as="textarea"
            type="text"
            id="note"
            placeholder="Masukan alamant pelanggan"
            isInvalid={!!formErrors?.note}
            rows={3}
            {...register('note')}
          />
          {formErrors?.note?.message ? (
            <Form.Control.Feedback type="invalid" className=" pt-1">
              {formErrors?.note?.message}
            </Form.Control.Feedback>
          ) : null}
        </Form.Group>
        <div>
          <p className="fw-bold text-gray ">Informasi</p>
          <Table bordered>
            <tbody>
              <TableRowInfo
                seperator={false}
                label="Layanan"
                value={`${selectedLaundryService?.name || '-'} (${
                  selectedLaundryService?.unit?.toLocaleLowerCase() || ''
                })`}
              />
              <TableRowInfo
                seperator={false}
                label="Harga"
                value={
                  selectedLaundryService?.price
                    ? uRupiah(Number(selectedLaundryService?.price) || 0)
                    : '-'
                }
              />
              <TableRowInfo
                seperator={false}
                label="Total "
                value={
                  selectedLaundryService?.price ? calculatedTotalPrice : '-'
                }
              />
            </tbody>
          </Table>
        </div>
      </div>

      <div className="pb-2 d-flex flex-column flex-sm-row gap-2 justify-content-end ">
        <BoxButton
          icon="Save"
          type="submit"
          size="lg"
          // isLoading={createLaundryQueueCtx?.isLoading}
          iconPos="end"
          isLoading={mutation.isLoading}
          className="order-1 order-sm-2"
        >
          {type === 'create' ? 'Tambah Cucian' : 'Ubah Cucian'}
        </BoxButton>
      </div>
    </Form>
  );
}

export default FormActionLaundryItem;
