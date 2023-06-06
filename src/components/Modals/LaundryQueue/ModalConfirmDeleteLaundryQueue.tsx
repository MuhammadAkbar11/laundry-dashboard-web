/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Button, Modal, Spinner } from 'react-bootstrap';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useNotification from '@hooks/useNotification';
import useEffectRun from '@hooks/useEffectRan';
import { deleteLaundryQueueService } from '@services/laundryQueueService';
import { useLaundryQueueDeleteContext } from '@utils/context/Laundry/LaundryQueue/LaundryQueueDeleteContext';

function ModalConfirmDeleteLaundryQueue() {
  const laundryQueueDelCtx = useLaundryQueueDeleteContext();
  const deleteData = laundryQueueDelCtx.data;

  const notif = useNotification();

  const queryClient = useQueryClient();
  const mutation = useMutation(deleteLaundryQueueService, {
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: deleteData?.fetchQueryKey,
      });
    },
  });

  useEffectRun(
    () => {
      if (!deleteData?.laundryQueueId && laundryQueueDelCtx?.showModal) {
        notif.danger('Tidak dapat menghapus data antrian, silahkan coba lagi', {
          duration: 6666,
        });
        laundryQueueDelCtx.onCloseModal();
      }
    },
    () => {},
    [notif, deleteData, laundryQueueDelCtx]
  );

  const onLaundryQueueDelete = () => {
    laundryQueueDelCtx.onSetLoading(true);
    // console.log(deleteData);
    mutation.mutate(deleteData?.laundryQueueId as string, {
      onSuccess(data) {
        laundryQueueDelCtx.onSetSuccess(true);
        laundryQueueDelCtx.onCloseModal();
        laundryQueueDelCtx.onSetLoading(false);
        notif.success(data?.message as string, { duration: 6666 });
      },
      onError(error: any) {
        laundryQueueDelCtx.onCloseModal();
        notif.danger('Gagal menghapus data antarian! silahkan coba lagi', {
          duration: 6666,
        });
        laundryQueueDelCtx.onSetLoading(false);
        laundryQueueDelCtx.onSetError(error);
      },
    });
  };

  return (
    <Modal
      size="sm"
      show={laundryQueueDelCtx.showModal}
      onHide={() => {
        if (!laundryQueueDelCtx.isLoading) {
          laundryQueueDelCtx.onCloseModal();
        }
      }}
      backdrop="static"
      contentClassName="p-2 rounded-0"
    >
      <Modal.Header closeButton className="border-0 pb-0 ">
        <Modal.Title className="d-none">
          Hapus Antrian <strong>{deleteData?.laundryQueueId || ''}</strong>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-flex">
        <div className="d-flex justify-content-center flex-column w-100 text-dark">
          {laundryQueueDelCtx.isLoading ? (
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
                Hapus data Antrian
              </h3>
              <h4
                className="text-center text-gray fw-light "
                style={{ lineHeight: '1.4rem' }}
              >
                Anda yakin ingin menghapus data antrian dengan ID{' '}
                <strong>{deleteData?.laundryQueueId || 'loading...'}</strong> ?
              </h4>
            </>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer className="pt-0 mt-0" style={{ border: '0px' }}>
        <div className="d-flex justify-content-center w-100 gap-2 ">
          {laundryQueueDelCtx.isLoading ? (
            <h4 className=" text-center text-secondary ">Harap Tunggu...</h4>
          ) : (
            <>
              <Button
                variant="slate"
                onClick={() => {
                  laundryQueueDelCtx.onCloseModal();
                }}
                className="px-4 rounded-0 text-dark "
              >
                Tidak
              </Button>
              <Button
                variant="danger"
                className="px-4 rounded-0 "
                onClick={() => onLaundryQueueDelete()}
                disabled={laundryQueueDelCtx.isLoading}
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

export default ModalConfirmDeleteLaundryQueue;
