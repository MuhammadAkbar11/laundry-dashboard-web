import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from 'react-bootstrap';
import BoxButton from '@components/Buttons/BoxButton';
import {
  UpdateLaundryServiceInputTypes,
  updateLaundryServiceSchema,
} from '@utils/schema/laundryServiceSchema';
import { useLaundryServiceActionsContext } from '@utils/context/Laundry/LaundryService/LaundryServiceActionsContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { putLaundrySrvService } from '@services/laundrySrvService';
import useNotification from '@hooks/useNotification';

function FormUpdateLaundryService() {
  const notif = useNotification();

  const laundryServiceActionsCtx = useLaundryServiceActionsContext();

  const selectedLaundryService = laundryServiceActionsCtx?.data?.laundryService;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fetchQueryKey = laundryServiceActionsCtx?.data?.fetchQueryKey as any[];

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset: resetForm,
  } = useForm<UpdateLaundryServiceInputTypes>({
    resolver: zodResolver(updateLaundryServiceSchema),
    defaultValues: {
      serviceId: selectedLaundryService?.name,
      description: selectedLaundryService?.description,
      name: selectedLaundryService?.name,
      unit: selectedLaundryService?.unit,
      price: Number(selectedLaundryService?.price || 0),
    },
  });

  const queryClient = useQueryClient();
  const mutation = useMutation(putLaundrySrvService, {
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: fetchQueryKey,
      });
    },
  });

  React.useEffect(() => {
    if (selectedLaundryService) {
      setValue('serviceId', selectedLaundryService?.serviceId);
    } else {
      notif.danger('Gagal menampilakan form, silahkan coba lagi', {
        id: `notifErrorUpdateLaundryService`,
      });
      laundryServiceActionsCtx.onCloseForm();
    }
  }, [selectedLaundryService, setValue, notif, laundryServiceActionsCtx]);

  const onSubmit = (inputs: UpdateLaundryServiceInputTypes) => {
    // Handle form submission here
    laundryServiceActionsCtx.onSetLoading(true);
    mutation.mutate(inputs, {
      onSuccess(data) {
        notif.success(data?.message as string);
        laundryServiceActionsCtx.onSetLoading(false);
        laundryServiceActionsCtx.onCloseForm();
        resetForm();
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onError(error: any) {
        laundryServiceActionsCtx.onSetLoading(false);
        const errMessage = error?.message || 'Gagal memperbaharui data!';
        notif.danger(errMessage);
        laundryServiceActionsCtx.onCloseForm();
        notif.danger(errMessage);
      },
    });
  };

  return (
    <Form
      onSubmit={handleSubmit(onSubmit)}
      className="h-100 d-flex flex-column justify-content-between "
    >
      <div>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="name">Nama Layanan</Form.Label>
          <Form.Control
            size="lg"
            type="text"
            id="name"
            placeholder="Masukkan nama category"
            isInvalid={!!errors?.name}
            disabled={mutation.isLoading}
            {...register('name')}
          />
          {errors?.name?.message && (
            <Form.Control.Feedback type="invalid" className="pt-1">
              {errors?.name?.message}
            </Form.Control.Feedback>
          )}
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="description">Deskripsi</Form.Label>
          <Form.Control
            size="lg"
            as="textarea"
            id="description"
            placeholder="Masukkan deskripsi"
            isInvalid={!!errors?.description}
            disabled={mutation.isLoading}
            {...register('description')}
          />
          {errors?.description?.message && (
            <Form.Control.Feedback type="invalid" className="pt-1">
              {errors?.description?.message}
            </Form.Control.Feedback>
          )}
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="unit">Satuan</Form.Label>
          <Form.Control
            size="lg"
            as="select"
            id="unit"
            isInvalid={!!errors?.unit}
            disabled={mutation.isLoading}
            defaultValue=""
            {...register('unit')}
          >
            <option value="" disabled>
              -- Pilih Satuan --
            </option>
            <option value="KG">KG - Kilogram</option>
            <option value="PTNG">PTNG - Potongan</option>
          </Form.Control>
          {errors?.unit?.message && (
            <Form.Control.Feedback type="invalid" className="pt-1">
              {errors?.unit?.message}
            </Form.Control.Feedback>
          )}
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="price">Harga</Form.Label>
          <Form.Control
            size="lg"
            type="number"
            id="price"
            placeholder="Masukkan Harga"
            isInvalid={!!errors?.price}
            disabled={mutation.isLoading}
            {...register('price', { valueAsNumber: true })}
          />
          {errors?.price?.message && (
            <Form.Control.Feedback type="invalid" className="pt-1">
              {errors?.price?.message}
            </Form.Control.Feedback>
          )}
        </Form.Group>
      </div>
      <div className="py-3 d-flex flex-column flex-sm-row gap-2 justify-content-end ">
        <BoxButton
          variant="primary"
          icon="Save"
          iconPos="end"
          size="lg"
          type="submit"
          className="w-100"
          isLoading={laundryServiceActionsCtx?.isLoading}
        >
          Simpan
        </BoxButton>
      </div>
    </Form>
  );
}

export default FormUpdateLaundryService;
