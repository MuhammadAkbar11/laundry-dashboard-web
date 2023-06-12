import React from 'react';
import { Button, Modal, Spinner } from 'react-bootstrap';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useNotification from '@hooks/useNotification';
import useEffectRun from '@hooks/useEffectRan';
import { deleteLaundryItemService } from '@services/laundryItemService';
import { useLaundryItemDeleteContext } from '@utils/context/Laundry/LaundryItemDeleteContext';

function ModalConfirmDeleteLaundryItem() {
  const laundryItemDelCtx = useLaundryItemDeleteContext();

  const deleteData = laundryItemDelCtx.data;
  const laundryItem = deleteData?.laundryItem;

  const notif = useNotification();

  const queryClient = useQueryClient();
  const mutation = useMutation(deleteLaundryItemService, {
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: deleteData?.fetchQueryKey,
      });
      queryClient.invalidateQueries({
        queryKey: [
          'laundriesData',
          { laundryQueueId: laundryItem?.laundryQueueId },
        ],
      });
    },
  });

  useEffectRun(
    () => {
      if (!laundryItem?.laundryId && laundryItemDelCtx?.showModal) {
        notif.danger('Tidak dapat menghapus data cucian, silahkan coba lagi', {
          duration: 6666,
        });
        laundryItemDelCtx.onCloseModal();
      }
    },
    () => {},
    [notif, deleteData, laundryItemDelCtx]
  );

  const onLaundryItemDelete = () => {
    laundryItemDelCtx.onSetLoading(true);
    mutation.mutate(laundryItem?.laundryId as string, {
      onSuccess(data) {
        laundryItemDelCtx.onSetSuccess(true);
        laundryItemDelCtx.onCloseModal();
        laundryItemDelCtx.onSetLoading(false);
        notif.success(data?.message as string, { duration: 6666 });
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onError(error: any) {
        laundryItemDelCtx.onCloseModal();
        notif.danger('Gagal menghapus data cucian! silahkan coba lagi', {
          duration: 6666,
        });
        laundryItemDelCtx.onSetLoading(false);
        laundryItemDelCtx.onSetError(error);
      },
    });
  };

  return (
    <Modal
      size="sm"
      show={laundryItemDelCtx.showModal}
      onHide={() => {
        if (!laundryItemDelCtx.isLoading) {
          laundryItemDelCtx.onCloseModal();
        }
      }}
      backdrop="static"
      contentClassName="p-2 rounded-0"
    >
      <Modal.Header closeButton className="border-0 pb-0 ">
        <Modal.Title className="d-none">
          Hapus Cucian <strong>{laundryItem?.laundryId || ''}</strong>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-flex">
        <div className="d-flex justify-content-center flex-column w-100 text-dark">
          {laundryItemDelCtx.isLoading ? (
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
                Hapus data Cucian
              </h3>
              <h4
                className="text-center text-gray fw-light "
                style={{ lineHeight: '1.4rem' }}
              >
                Anda yakin ingin menghapus data cucian dengan ID{' '}
                <strong>{laundryItem?.laundryId || 'loading...'}</strong> ?
              </h4>
            </>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer className="pt-0 mt-0" style={{ border: '0px' }}>
        <div className="d-flex justify-content-center w-100 gap-2 ">
          {laundryItemDelCtx.isLoading ? (
            <h4 className=" text-center text-secondary ">Harap Tunggu...</h4>
          ) : (
            <>
              <Button
                variant="slate"
                onClick={() => {
                  laundryItemDelCtx.onCloseModal();
                }}
                className="px-4 rounded-0 text-dark "
              >
                Tidak
              </Button>
              <Button
                variant="danger"
                className="px-4 rounded-0 "
                onClick={() => onLaundryItemDelete()}
                disabled={laundryItemDelCtx.isLoading}
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

export default ModalConfirmDeleteLaundryItem;
