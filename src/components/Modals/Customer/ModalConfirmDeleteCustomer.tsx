/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Button, Modal, Spinner } from 'react-bootstrap';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useNotification from '@hooks/useNotification';
import { deleteCustomerService } from '@/services/customerService';
import { useCustomerDeleteContext } from '@utils/context/Customer/CustomerDeleteContext';
import useEffectRun from '@hooks/useEffectRan';

function ModalConfirmationCustomerDelete() {
  const customerDeleteCtx = useCustomerDeleteContext();
  const deleteData = customerDeleteCtx.data;

  const notif = useNotification();

  const queryClient = useQueryClient();
  const mutation = useMutation(deleteCustomerService, {
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: deleteData?.fetchQueryKey,
      });
    },
  });

  useEffectRun(
    () => {
      if (!deleteData?.customerId && customerDeleteCtx?.showModal) {
        notif.danger(
          'Tidak dapat menghapus data pelanggan, silahkan coba lagi',
          {
            duration: 6666,
          }
        );
        customerDeleteCtx.onCloseModal();
      }
    },
    () => {},
    [notif, deleteData, customerDeleteCtx]
  );

  const onCustomerDelete = () => {
    customerDeleteCtx.onSetLoading(true);
    // console.log(deleteData);
    mutation.mutate(deleteData?.customerId as string, {
      onSuccess(data) {
        customerDeleteCtx.onSetSuccess(true);
        customerDeleteCtx.onCloseModal();
        customerDeleteCtx.onSetLoading(false);
        notif.success(data?.message as string, { duration: 6666 });
      },
      onError(error: any) {
        customerDeleteCtx.onCloseModal();
        notif.danger('Gagal menghapus data pelanggan! silahkan coba lagi', {
          duration: 6666,
        });
        customerDeleteCtx.onSetLoading(false);
        customerDeleteCtx.onSetError(error);
      },
    });
  };

  return (
    <Modal
      size="sm"
      show={customerDeleteCtx.showModal}
      onHide={() => {
        if (!customerDeleteCtx.isLoading) {
          customerDeleteCtx.onCloseModal();
        }
      }}
      contentClassName="p-2"
    >
      <Modal.Header closeButton className="border-0 pb-0 ">
        <Modal.Title className="d-none">
          Hapus Pelanggan <strong>{deleteData?.customerId || ''}</strong>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-flex">
        <div className="d-flex justify-content-center flex-column w-100 text-dark">
          {customerDeleteCtx.isLoading ? (
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
                Hapus data Pelanggan
              </h3>
              <h4
                className="text-center text-gray fw-light "
                style={{ lineHeight: '1.4rem' }}
              >
                Anda yakin ingin menghapus data pelanggan dengan ID{' '}
                <strong>{deleteData?.customerId || 'loading...'}</strong> ?
              </h4>
            </>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer className="pt-0 mt-0" style={{ border: '0px' }}>
        <div className="d-flex justify-content-center w-100 gap-2 ">
          {customerDeleteCtx.isLoading ? (
            <h4 className=" text-center text-secondary ">Harap Tunggu...</h4>
          ) : (
            <>
              <Button
                variant="secondary"
                onClick={() => {
                  customerDeleteCtx.onCloseModal();
                }}
                className="px-4"
              >
                Tidak
              </Button>
              <Button
                variant="danger"
                className="px-4"
                onClick={() => onCustomerDelete()}
                disabled={customerDeleteCtx.isLoading}
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

export default ModalConfirmationCustomerDelete;
