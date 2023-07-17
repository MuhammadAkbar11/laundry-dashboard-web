import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from 'react-bootstrap';
import BoxButton from '@components/Buttons/BoxButton';
import {
  CreateUserInputTypes,
  createUserSchema,
} from '@utils/schema/userSchema';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useNotification from '@hooks/useNotification';
import { postUserService } from '@services/userService';
import { useUserActionsContext } from '@utils/context/User/UserActionsContext';

function FormCreateUser() {
  const notif = useNotification();

  const userActionsCtx = useUserActionsContext();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fetchQueryKey = userActionsCtx?.data?.fetchQueryKey as any[];

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset: resetForm,
  } = useForm<CreateUserInputTypes>({
    resolver: zodResolver(createUserSchema),
  });

  const queryClient = useQueryClient();
  const mutation = useMutation(postUserService, {
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: fetchQueryKey,
      });
    },
  });

  const onSubmit = (inputs: CreateUserInputTypes) => {
    // Handle form submission here
    userActionsCtx.onSetLoading(true);
    mutation.mutate(inputs, {
      onSuccess(data) {
        notif.success(data?.message as string, { duration: 6666 });
        userActionsCtx.onSetLoading(false);
        userActionsCtx.onCloseForm();
        resetForm();
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onError(error: any) {
        userActionsCtx.onSetLoading(false);
        const errMessage = error?.message || 'Gagal menambahkan data!';
        notif.danger(errMessage);
        if (!error?.name?.includes('DUPLICATE_ENTRY'))
          userActionsCtx.onCloseForm();
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
          <Form.Label htmlFor="name">Nama</Form.Label>
          <Form.Control
            size="lg"
            type="text"
            id="name"
            placeholder="Masukkan nama"
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
          <Form.Label htmlFor="email">Email</Form.Label>
          <Form.Control
            size="lg"
            type="text"
            id="email"
            placeholder="Masukkan email"
            isInvalid={!!errors?.email}
            {...register('email')}
          />
          {errors?.email?.message && (
            <Form.Control.Feedback type="invalid" className="pt-1">
              {errors?.email?.message}
            </Form.Control.Feedback>
          )}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="role">Role</Form.Label>
          <Form.Control
            size="lg"
            as="select"
            id="role"
            isInvalid={!!errors?.role}
            {...register('role')}
            defaultValue=""
          >
            <option value="" disabled>
              -- Pilih Role --
            </option>
            <option value="ADMIN">ADMIN</option>
            <option value="CASHIER">CASHIER</option>
            <option value="OFFICER">OFFICER</option>
          </Form.Control>
          {errors?.role?.message && (
            <Form.Control.Feedback type="invalid" className="pt-1">
              {errors?.role?.message}
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
          isLoading={userActionsCtx?.isLoading}
        >
          Simpan
        </BoxButton>
      </div>
    </Form>
  );
}

export default FormCreateUser;
