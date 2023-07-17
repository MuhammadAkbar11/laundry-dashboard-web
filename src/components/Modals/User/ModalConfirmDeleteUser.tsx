import React from 'react';
import { Button, Modal, Spinner } from 'react-bootstrap';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useNotification from '@hooks/useNotification';
import useEffectRun from '@hooks/useEffectRan';
import { useUserDeleteContext } from '@utils/context/User/UserDeleteContext';
import { deleteUserService } from '@services/userService';

function ModalConfirmDeleteUser() {
  const userDelCtx = useUserDeleteContext();

  const deleteData = userDelCtx.data;
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
      if (!laundryService?.userId && userDelCtx?.showModal) {
        notif.danger('Tidak dapat menghapus data user, silahkan coba lagi');
        userDelCtx.onCloseModal();
      }
    },
    () => {},
    [notif, deleteData, userDelCtx]
  );

  const onLaundryServiceDelete = () => {
    userDelCtx.onSetLoading(true);
    mutation.mutate(laundryService?.userId as string, {
      onSuccess(data) {
        userDelCtx.onSetSuccess(true);
        userDelCtx.onCloseModal();
        userDelCtx.onSetLoading(false);
        notif.success(data?.message as string);
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onError(error: any) {
        userDelCtx.onCloseModal();
        notif.danger('Gagal menghapus data user! silahkan coba lagi');
        userDelCtx.onSetLoading(false);
        userDelCtx.onSetError(error);
      },
    });
  };

  return (
    <Modal
      size="sm"
      show={userDelCtx.showModal}
      onHide={() => {
        if (!userDelCtx.isLoading) {
          userDelCtx.onCloseModal();
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
          {userDelCtx.isLoading ? (
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
          {userDelCtx.isLoading ? (
            <h4 className=" text-center text-secondary ">Harap Tunggu...</h4>
          ) : (
            <>
              <Button
                variant="slate"
                onClick={() => {
                  userDelCtx.onCloseModal();
                }}
                className="px-4 rounded-0 text-dark "
              >
                Tidak
              </Button>
              <Button
                variant="danger"
                className="px-4 rounded-0 "
                onClick={() => onLaundryServiceDelete()}
                disabled={userDelCtx.isLoading}
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

export default ModalConfirmDeleteUser;
