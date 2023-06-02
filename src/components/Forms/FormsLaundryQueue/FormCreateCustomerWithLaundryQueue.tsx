/* eslint-disable react/display-name */
/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import useNotification from '@hooks/useNotification';
import useGetCustomerLevels from '@hooks/useGetCustomerLevels';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLaundryQueueCreateContext } from '@utils/context/Laundry/LaundryQueue/LaundryQueueCreateContext';
import BoxButton from '@components/Buttons/BoxButton';
import {
  CreateLaundryQueueWithCustomerInputTypes,
  createLaundryQueueWithCustomerSchema,
} from '@utils/schema/laundryQueueSchema';
import { postLaundryQueueAndCustomerService } from '@services/laundryQueueService';
import { runFakerJsInDev } from '@utils/utils';

type Props = {};

const formDefaultValues = {
  point:
    runFakerJsInDev<number>((fk) =>
      fk.helpers.arrayElement([0, 5, 10, 15, 20])
    ) || 0,
  name: runFakerJsInDev<string>((fk) => fk.name.fullName()) || '',
  phone:
    runFakerJsInDev<string>((fk) => fk.phone.number('+628 #### #### ##')) || '',
  address: runFakerJsInDev<string>((fk) => fk.address.streetAddress()) || '',
};

function FormCreateCustomerWithLaundryQueue({}: Props) {
  const notif = useNotification();
  // const customerPageCtx = useCustomerPageContext();

  // const fetchQueryKey = customerPageCtx?.formActionOffCanvas?.data
  //   ?.fetchQueryKey as any[];

  const createLaundryQueueCtx = useLaundryQueueCreateContext();
  const formType = createLaundryQueueCtx?.formType;

  const methods = useForm<CreateLaundryQueueWithCustomerInputTypes>({
    resolver: zodResolver(createLaundryQueueWithCustomerSchema),
    defaultValues: formDefaultValues,
  });

  const customerLevelsData = useGetCustomerLevels();

  const {
    register,
    handleSubmit,
    // reset: resetFormCustomer,
    clearErrors: clearFormCustomerErrors,
    formState: { errors: formErrors },
  } = methods;

  const fetchLaundryQueueQueryKey = React.useMemo(() => {
    return createLaundryQueueCtx.data?.fetchQueryKey as any[];
  }, [createLaundryQueueCtx.data]);

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (values: CreateLaundryQueueWithCustomerInputTypes) =>
      postLaundryQueueAndCustomerService(values),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: fetchLaundryQueueQueryKey,
      });
    },
  });

  React.useEffect(() => {
    if (formType !== 'newCustomer') {
      clearFormCustomerErrors();
    }

    return () => {
      clearFormCustomerErrors();
    };
  }, [formType, clearFormCustomerErrors]);

  const onSubmitHandler = (
    inputs: CreateLaundryQueueWithCustomerInputTypes
  ) => {
    createLaundryQueueCtx.onSetLoading(true);
    mutation.mutate(inputs, {
      onSuccess(data: any) {
        notif.success(data?.message as string);
        createLaundryQueueCtx.onSetLoading(false);
        createLaundryQueueCtx.onCloseForm();
      },
      onError(error: any) {
        createLaundryQueueCtx.onSetLoading(false);
        const errMessage = error?.message || 'Gagal menambahkan data!';
        notif.danger(errMessage);
        createLaundryQueueCtx.onCloseForm();
      },
    });
  };

  return (
    <Form
      method="POST"
      className="h-100 d-flex flex-column justify-content-between "
      onSubmit={handleSubmit(onSubmitHandler)}
    >
      <div>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="name">Nama</Form.Label>
          <Form.Control
            type="text"
            id="name"
            placeholder="Masukan nama pelanggan"
            isInvalid={!!formErrors?.name}
            {...register('name')}
          />
          {formErrors?.name?.message ? (
            <Form.Control.Feedback type="invalid" className=" pt-1">
              {formErrors?.name?.message}
            </Form.Control.Feedback>
          ) : null}
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="phone">No. Telpon</Form.Label>
          <Form.Control
            type="text"
            id="phone"
            placeholder="Masukan no. telpon pelanggan"
            isInvalid={!!formErrors?.phone}
            {...register('phone')}
          />
          {formErrors?.phone?.message ? (
            <Form.Control.Feedback type="invalid" className=" pt-1">
              {formErrors?.phone?.message}
            </Form.Control.Feedback>
          ) : null}
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="address">Alamat</Form.Label>
          <Form.Control
            as="textarea"
            type="text"
            id="address"
            placeholder="Masukan alamant pelanggan"
            isInvalid={!!formErrors?.address}
            rows={3}
            {...register('address')}
          />
          {formErrors?.address?.message ? (
            <Form.Control.Feedback type="invalid" className=" pt-1">
              {formErrors?.address?.message}
            </Form.Control.Feedback>
          ) : null}
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="customerLevelId">Level</Form.Label>
          <Form.Select
            id="customerLevelId"
            // placeholder="Masukan alamant pelanggan"
            isInvalid={!!formErrors?.customerLevelId}
            {...register('customerLevelId')}
            disabled={customerLevelsData?.isLoading}
            defaultValue=""
          >
            <option value="" disabled>
              Pilih Level Pelanggan
            </option>
            {customerLevelsData?.data
              ? customerLevelsData?.data?.map((lvl) => {
                  return (
                    <option
                      key={lvl.customerLevelId}
                      value={lvl.customerLevelId}
                    >
                      {lvl.name}
                    </option>
                  );
                })
              : null}
          </Form.Select>
          {formErrors?.customerLevelId?.message ? (
            <Form.Control.Feedback type="invalid" className=" pt-1">
              {formErrors?.customerLevelId?.message}
            </Form.Control.Feedback>
          ) : null}
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="point">Point</Form.Label>
          <Form.Control
            type="number"
            id="point"
            placeholder="Masukan point"
            isInvalid={!!formErrors?.point}
            {...register('point', {
              valueAsNumber: true,
            })}
          />
          {formErrors?.point?.message ? (
            <Form.Control.Feedback type="invalid" className=" pt-1">
              {formErrors?.point?.message}
            </Form.Control.Feedback>
          ) : null}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="deliveryType">Pilih Jenis Pengiriman</Form.Label>
          <Form.Select
            size="lg"
            id="deliveryType"
            // placeholder="Masukan alamant pelanggan"
            isInvalid={!!formErrors?.deliveryType}
            {...register('deliveryType')}
            defaultValue=""
          >
            <option value="" disabled>
              Pilih Jenis Pengiriman
            </option>
            <option value="PICKUP">Pickup / Jemput</option>
            <option value="DELIVERED">Antar</option>
          </Form.Select>
          {formErrors?.deliveryType?.message ? (
            <Form.Control.Feedback type="invalid" className=" pt-1">
              {formErrors?.deliveryType?.message}
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
      </div>

      <div className="py-3 d-flex flex-column flex-sm-row gap-2 justify-content-end ">
        <BoxButton
          variant="slate"
          icon="User"
          size="lg"
          disabled={createLaundryQueueCtx?.isLoading}
          iconPos="end"
          className="order-1 order-sm-2 text-dark"
          onClick={() => {
            createLaundryQueueCtx.onSetData({
              customer: null,
              fetchQueryKey: fetchLaundryQueueQueryKey,
            });
            createLaundryQueueCtx.onSetFormType('existingCustomer');
          }}
        >
          Pilih Pelanggan
        </BoxButton>
        <BoxButton
          icon="Save"
          type="submit"
          size="lg"
          isLoading={createLaundryQueueCtx?.isLoading}
          iconPos="end"
          className="order-1 order-sm-2"
        >
          Buat Antrian
        </BoxButton>
      </div>
    </Form>
  );
}

export default FormCreateCustomerWithLaundryQueue;
