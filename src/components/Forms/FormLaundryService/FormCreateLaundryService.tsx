import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, Button } from 'react-bootstrap';
import BoxButton from '@components/Buttons/BoxButton';
import {
  CreateLaundryServiceInputTypes,
  createLaundryServiceSchema,
} from '@utils/schema/laundryServiceSchema';
import { useLaundryServiceActionsContext } from '@utils/context/Laundry/LaundryService/LaundryServiceActionsContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postLaundrySrvService } from '@services/laundrySrvService';
import useNotification from '@hooks/useNotification';

function FormCreateLaundryService() {
  const notif = useNotification();

  const laundryServiceActionsCtx = useLaundryServiceActionsContext();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fetchQueryKey = laundryServiceActionsCtx?.data?.fetchQueryKey as any[];

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset: resetForm,
  } = useForm<CreateLaundryServiceInputTypes>({
    resolver: zodResolver(createLaundryServiceSchema),
  });

  const queryClient = useQueryClient();
  const mutation = useMutation(postLaundrySrvService, {
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: fetchQueryKey,
      });
    },
  });

  const onSubmit = (inputs: CreateLaundryServiceInputTypes) => {
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
        const errMessage = error?.message || 'Gagal menambahkan data!';
        notif.danger(errMessage);
        laundryServiceActionsCtx.onCloseForm();
        notif.danger(errMessage);
      },
    });
    // Reset the form after successful submission
    // reset();
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
            {...register('unit')}
            defaultValue=""
          >
            <option value="" disabled>
              -- Pilih Satuan --
            </option>
            <option value="KG">Kilogram</option>
            <option value="PTNG">Pcs</option>
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
          isLoading={laundryServiceActionsCtx?.isLoading}
        >
          Simpan
        </BoxButton>
      </div>
    </Form>
  );
}

export default FormCreateLaundryService;
