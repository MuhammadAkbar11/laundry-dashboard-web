import React from 'react';
import { Button, Modal, Spinner } from 'react-bootstrap';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useNotification from '@hooks/useNotification';
import useEffectRun from '@hooks/useEffectRan';
import { deleteUserService } from '@services/userService';
import { useUserResetPasswordContext } from '@utils/context/User/UserResetPasswordContext';

function ModalConfirmResetUserPw() {
  const userResetPasswordCtx = useUserResetPasswordContext();

  const deleteData = userResetPasswordCtx.data;
  const laundryService = deleteData?.user;

  const notif = useNotification();

  const queryClient = useQueryClient();
  const mutation = useMutation(deleteUserService, {
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: deleteData?.fetchQueryKey,
      });
    },
  });

  useEffectRun(
    () => {
      if (!laundryService?.userId && userResetPasswordCtx?.showModal) {
        notif.danger('Tidak dapat menghapus data user, silahkan coba lagi');
        userResetPasswordCtx.onCloseModal();
      }
    },
    () => {},
    [notif, deleteData, userResetPasswordCtx]
  );

  const onLaundryServiceDelete = () => {
    userResetPasswordCtx.onSetLoading(true);
    mutation.mutate(laundryService?.userId as string, {
      onSuccess(data) {
        userResetPasswordCtx.onSetSuccess(true);
        userResetPasswordCtx.onCloseModal();
        userResetPasswordCtx.onSetLoading(false);
        notif.success(data?.message as string);
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onError(error: any) {
        userResetPasswordCtx.onCloseModal();
        notif.danger('Gagal menghapus data user! silahkan coba lagi');
        userResetPasswordCtx.onSetLoading(false);
        userResetPasswordCtx.onSetError(error);
      },
    });
  };

  return (
    <Modal
      size="sm"
      show={userResetPasswordCtx.showModal}
      onHide={() => {
        if (!userResetPasswordCtx.isLoading) {
          userResetPasswordCtx.onCloseModal();
        }
      }}
      backdrop="static"
      contentClassName="p-2 rounded-0"
    >
      <Modal.Header closeButton className="border-0 pb-0 ">
        <Modal.Title className="d-none">
          Hapus User <strong>{laundryService?.userId || ''}</strong>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-flex">
        <div className="d-flex justify-content-center flex-column w-100 text-dark">
          {userResetPasswordCtx.isLoading ? (
            <div
              className="text-center py-3"
              style={{ transform: 'scale(2)', fontSize: 18 }}
            >
              <Spinner animation="border" role="status" variant="secondary">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : (
            <>
              <h3 className="text-center text-capitalize mb-3 fw-bold ">
                Hapus data user
              </h3>
              <h4
                className="text-center text-gray fw-light "
                style={{ lineHeight: '1.4rem' }}
              >
                Anda yakin ingin menghapus data user dengan ID{' '}
                <strong>{laundryService?.userId || 'loading...'}</strong> ?
              </h4>
            </>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer className="pt-0 mt-0" style={{ border: '0px' }}>
        <div className="d-flex justify-content-center w-100 gap-2 ">
          {userResetPasswordCtx.isLoading ? (
            <h4 className=" text-center text-secondary ">Harap Tunggu...</h4>
          ) : (
            <>
              <Button
                variant="slate"
                onClick={() => {
                  userResetPasswordCtx.onCloseModal();
                }}
                className="px-4 rounded-0 text-dark "
              >
                Tidak
              </Button>
              <Button
                variant="danger"
                className="px-4 rounded-0 "
                onClick={() => onLaundryServiceDelete()}
                disabled={userResetPasswordCtx.isLoading}
              >
                Ya
              </Button>
            </>
          )}
        </div>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalConfirmResetUserPw;
