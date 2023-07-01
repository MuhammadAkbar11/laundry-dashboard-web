/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
// import { useMutation } from '@tanstack/react-query';
import useNotification from '@hooks/useNotification';
import {
  UpdateCustomerInputTypes,
  updateCustomerSchema,
} from '@utils/schema/customerSchema';
import useGetCustomerLevels from '@hooks/useGetCustomerLevels';
import { putCustomerService } from '@/services/customerService';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCustomerPageContext } from '@utils/context/Customer/CustomerPageContext';
import { ICustomer, IServiceWithPaginateReturn } from '@utils/interfaces';
import useEffectRun from '@hooks/useEffectRan';

type Props = {};

function FormUpdateCustomer({}: Props) {
  const [loading, setLoading] = React.useState(false);

  const queryClient = useQueryClient();

  const notif = useNotification();
  const customerPageCtx = useCustomerPageContext();

  const formActionOffCanvas = customerPageCtx?.formActionOffCanvas;
  const customerData = formActionOffCanvas?.data?.customer as ICustomer;
  const fetchQueryKey = customerPageCtx.formActionOffCanvas?.data
    ?.fetchQueryKey as any[];

  const methods = useForm<UpdateCustomerInputTypes>({
    resolver: zodResolver(updateCustomerSchema),
    defaultValues: {},
  });

  const customerLevelsData = useGetCustomerLevels();

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = methods;

  const mutation = useMutation({
    mutationFn: putCustomerService,
    onMutate: async (newCustomer) => {
      await queryClient.cancelQueries({
        queryKey: fetchQueryKey,
      });

      const previousData = queryClient.getQueryData(
        fetchQueryKey
      ) as IServiceWithPaginateReturn<ICustomer>;

      const prevDataRows = previousData?.rows;
      const selectedDataIdx = previousData?.rows?.findIndex(
        (col) => col.customerId === getValues('customerId')
      );
      prevDataRows[selectedDataIdx] = newCustomer as ICustomer;

      const newData = {
        ...previousData,
        rows: prevDataRows,
      };

      queryClient.setQueryData(fetchQueryKey, newData);

      return { previousData, newData };
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(fetchQueryKey, context?.previousData);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: fetchQueryKey,
      });
    },
  });

  // React.useEffect(() => {
  //   const redirect = router.query?.redirect?.toString() || '/';

  //   if (mutation.isSuccess) {
  //     router.push(redirect);
  //   }
  // }, [mutation.isSuccess, router]);

  React.useEffect(() => {
    if (customerData) {
      setValue('customerId', customerData?.customerId);
      setValue('name', customerData?.name);
      setValue('address', customerData?.address);
      setValue('point', customerData?.point);
      setValue('phone', customerData?.phone);
      setValue('customerLevelId', customerData?.customerLevelId);
    } else {
      customerPageCtx.onToggleFormActionOffCanvas({
        open: false,
        formType: 'initial',
        data: null,
      });
    }
  }, [customerData, setValue, customerPageCtx]);

  useEffectRun(
    () => {
      if (!customerData && formActionOffCanvas?.open) {
        notif.danger(
          'Gagal menampilakan form ubah data pelanggan, silahkan coba lagi',
          {
            duration: 6666,
          }
        );
      }
    },
    () => {},
    [notif, customerData, formActionOffCanvas]
  );

  const onSubmitHandler = (inputs: UpdateCustomerInputTypes) => {
    setLoading(true);
    mutation.mutate(inputs, {
      async onSuccess(data) {
        customerPageCtx.onToggleFormActionOffCanvas({
          open: false,
          formType: 'initial',
          data: null,
        });
        notif.success(data?.message as string, { duration: 10000 });
        setLoading(false);
      },
      // on
      onError(error: any) {
        setLoading(false);
        // eslint-disable-next-line no-console
        const errMessage = error?.message || 'Gagal mengubah data!';
        customerPageCtx.onToggleFormActionOffCanvas({
          open: false,
          formType: 'initial',
          data: null,
        });
        notif.danger(errMessage);
      },
    });
  };

  return (
    <Form method="POST" onSubmit={handleSubmit(onSubmitHandler)}>
      <div className="mb-3">
        <Form.Label htmlFor="customerId">ID Pelangan</Form.Label>
        <Form.Control
          size="lg"
          type="text"
          id="customerId"
          placeholder="Masukan nama pelanggan"
          disabled
          // isInvalid={!!errors?.name}
          {...register('customerId')}
        />
        {/* {errors?.name?.message ? (
          <Form.Control.Feedback type="invalid" className=" pt-1">
            {errors?.name?.message}
          </Form.Control.Feedback>
        ) : null} */}
      </div>
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
      </div>
    </Form>
  );
}

export default FormUpdateCustomer;
