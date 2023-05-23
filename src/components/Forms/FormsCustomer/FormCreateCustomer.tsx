/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import useNotification from '@hooks/useNotification';
import {
  CreateCustomerInputTypes,
  createCustomerSchema,
} from '@utils/schema/customerSchema';
import useGetCustomerLevels from '@hooks/useGetCustomerLevels';
import { postCustomerService } from '@/services/customerService';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCustomerPageContext } from '@utils/context/Customer/CustomerPageContext';

type Props = {};

function FormCreateCustomer({}: Props) {
  const [loading, setLoading] = React.useState(false);
  const notif = useNotification();
  const customerPageCtx = useCustomerPageContext();

  const fetchQueryKey = customerPageCtx?.formActionOffCanvas?.data
    ?.fetchQueryKey as any[];

  const methods = useForm<CreateCustomerInputTypes>({
    resolver: zodResolver(createCustomerSchema),
    defaultValues: {
      point: 0,
    },
  });

  const customerLevelsData = useGetCustomerLevels();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const queryClient = useQueryClient();
  const mutation = useMutation(postCustomerService, {
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: fetchQueryKey,
      });
    },
  });

  const onSubmitHandler = (inputs: CreateCustomerInputTypes) => {
    setLoading(true);
    mutation.mutate(inputs, {
      onSuccess(data) {
        customerPageCtx.onToggleFormActionOffCanvas({
          open: false,
          formType: 'initial',
          data: null,
        });
        notif.success(data?.message as string, { duration: 10000 });
        setLoading(false);
      },
      onError(error: any) {
        setLoading(false);
        // eslint-disable-next-line no-console
        const errMessage = error?.message || 'Gagal menambahkan data!';
        notif.danger(errMessage);
      },
    });
  };

  return (
    <Form method="POST" onSubmit={handleSubmit(onSubmitHandler)}>
      <div className="mb-3">
        <Form.Label htmlFor="name">Nama</Form.Label>
        <Form.Control
          size="lg"
          type="text"
          id="name"
          placeholder="Masukan nama pelanggan"
          isInvalid={!!errors?.name}
          {...register('name')}
        />
        {errors?.name?.message ? (
          <Form.Control.Feedback type="invalid" className=" pt-1">
            {errors?.name?.message}
          </Form.Control.Feedback>
        ) : null}
      </div>
      <div className="mb-3">
        <Form.Label htmlFor="phone">No. Telpon</Form.Label>
        <Form.Control
          size="lg"
          type="text"
          id="phone"
          placeholder="Masukan no. telpon pelanggan"
          isInvalid={!!errors?.phone}
          {...register('phone')}
        />
        {errors?.phone?.message ? (
          <Form.Control.Feedback type="invalid" className=" pt-1">
            {errors?.phone?.message}
          </Form.Control.Feedback>
        ) : null}
      </div>
      <div className="mb-3">
        <Form.Label htmlFor="address">Alamat</Form.Label>
        <Form.Control
          size="lg"
          as="textarea"
          type="text"
          id="address"
          placeholder="Masukan alamant pelanggan"
          isInvalid={!!errors?.address}
          rows={3}
          {...register('address')}
        />
        {errors?.address?.message ? (
          <Form.Control.Feedback type="invalid" className=" pt-1">
            {errors?.address?.message}
          </Form.Control.Feedback>
        ) : null}
      </div>
      <div className="mb-3">
        <Form.Label htmlFor="customerLevelId">Level</Form.Label>
        <Form.Select
          size="lg"
          id="customerLevelId"
          // placeholder="Masukan alamant pelanggan"
          isInvalid={!!errors?.customerLevelId}
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
                  <option key={lvl.customerLevelId} value={lvl.customerLevelId}>
                    {lvl.name}
                  </option>
                );
              })
            : null}
        </Form.Select>
        {errors?.customerLevelId?.message ? (
          <Form.Control.Feedback type="invalid" className=" pt-1">
            {errors?.customerLevelId?.message}
          </Form.Control.Feedback>
        ) : null}
      </div>
      <div className="mb-3">
        <Form.Label htmlFor="point">Point</Form.Label>
        <Form.Control
          size="lg"
          type="number"
          id="point"
          placeholder="Masukan point"
          isInvalid={!!errors?.point}
          {...register('point', {
            valueAsNumber: true,
          })}
        />
        {errors?.point?.message ? (
          <Form.Control.Feedback type="invalid" className=" pt-1">
            {errors?.point?.message}
          </Form.Control.Feedback>
        ) : null}
      </div>

      <div className="text-center mt-4 d-flex">
        <button
          type="submit"
          className="btn btn-lg w-100 btn-primary"
          disabled={loading}
        >
          Simpan
        </button>
        {/* <button type="submit" class="btn btn-lg btn-primary">Sign in</button> */}
      </div>
    </Form>
  );
}

export default FormCreateCustomer;
