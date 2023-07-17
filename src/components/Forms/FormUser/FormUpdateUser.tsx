/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from 'react-bootstrap';
import BoxButton from '@components/Buttons/BoxButton';
import {
  UpdateUserInputTypes,
  updateUserSchema,
} from '@utils/schema/userSchema';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useNotification from '@hooks/useNotification';
import { postUserService, putUserService } from '@services/userService';
import { useUserActionsContext } from '@utils/context/User/UserActionsContext';
import { UserRoleTypes } from '@types';
import { API_URI } from '@configs/varsConfig';
import FeatherIcon from '@components/Icons/FeatherIcon';

function FormUpdateUser() {
  const notif = useNotification();

  const userActionsCtx = useUserActionsContext();

  const selectedUser = userActionsCtx?.data?.user;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fetchQueryKey = userActionsCtx?.data?.fetchQueryKey as any[];

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset: resetForm,
  } = useForm<UpdateUserInputTypes>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: selectedUser?.name || '',
      email: (selectedUser?.email as string) || '',
      role: (selectedUser?.role as UserRoleTypes) || '',
    },
  });

  const queryClient = useQueryClient();
  const mutation = useMutation(putUserService, {
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: fetchQueryKey,
      });
    },
  });

  React.useEffect(() => {
    if (selectedUser) {
      // const fileList = new DataTransfer();
      // fileList.items?.add(selectedUser.avatar as File);
      // setValue('avatar', fileList.files);
    } else {
      notif.danger('Gagal menampilakan form, silahkan coba lagi', {
        id: `notifErrorUpdateUser`,
      });
      userActionsCtx.onCloseForm();
    }
  }, [selectedUser, setValue, notif, userActionsCtx]);

  const onSubmit = (inputs: UpdateUserInputTypes) => {
    // Handle form submission here
    userActionsCtx.onSetLoading(true);
    mutation.mutate(
      {
        ...inputs,
        userId: selectedUser?.userId as string,
      },
      {
        onSuccess(data) {
          notif.success(data?.message as string);
          userActionsCtx.onSetLoading(false);
          userActionsCtx.onCloseForm();
          resetForm();
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError(error: any) {
          userActionsCtx.onSetLoading(false);
          const errMessage = error?.message || 'Gagal memperbaharui data!';
          notif.danger(errMessage);
          if (!error?.name?.includes('DUPLICATE_ENTRY'))
            userActionsCtx.onCloseForm();
        },
      }
    );
    // Reset the form after successful submission
    // reset();
  };

  const avatarValue = watch('avatar');

  const avatarImg =
    avatarValue && avatarValue?.length !== 0 ? (
      <div
        className="avatar-upload-img "
        style={{
          height: 120,
          width: 120,
        }}
      >
        <img
          className=" w-100 h-100  "
          src={URL?.createObjectURL(avatarValue[0])}
          alt=""
        />
        <div className="avatar-upload-img-icon text-white">
          <FeatherIcon name="Upload" />
        </div>
      </div>
    ) : (
      <div
        style={{
          height: 120,
          width: 120,
        }}
        className="avatar-upload-img "
      >
        <img
          className=" w-100 h-100  "
          src={`${API_URI}${selectedUser?.avatar}`}
          alt=""
        />
        <div className="avatar-upload-img-icon text-white">
          <FeatherIcon name="Upload" />
        </div>
      </div>
    );
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
        <Form.Group className="d-flex flex-column">
          <Form.Label>Foto Profil</Form.Label>
          <div className="avatar-upload ">
            <Form.Label htmlFor="avatar">{avatarImg}</Form.Label>
            <input
              id="avatar"
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              {...register('avatar')}
            />
            {errors?.avatar?.message ? (
              <div className=" d-flex justify-content-start pt-1 text-danger ">
                <small className=" text-start ">
                  {(errors?.avatar?.message as string) || ''}
                </small>
              </div>
            ) : null}
          </div>
        </Form.Group>
        {/* <div className="image-upload text-center">
          <label htmlFor="avatar">{avatarImg}</label>
        </div> */}
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

export default FormUpdateUser;
