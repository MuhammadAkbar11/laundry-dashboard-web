import React from 'react';
import { Button, Modal, Spinner } from 'react-bootstrap';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useNotification from '@hooks/useNotification';
import useEffectRun from '@hooks/useEffectRan';
import { useLaundryServiceDeleteContext } from '@utils/context/Laundry/LaundryService/LaundryServiceDeleteContext';
import { deleteLaundrySrvService } from '@services/laundrySrvService';
// import { deleteLaundryServiceService } from '@services/laundryServiceService';

function ModalConfirmDeleteLaundryService() {
  const laundryServiceDelCtx = useLaundryServiceDeleteContext();

  const deleteData = laundryServiceDelCtx.data;
  const laundryService = deleteData?.laundryService;

  const notif = useNotification();

  const queryClient = useQueryClient();
  const mutation = useMutation(deleteLaundrySrvService, {
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: deleteData?.fetchQueryKey,
      });
    },
  });

  useEffectRun(
    () => {
      if (!laundryService?.serviceId && laundryServiceDelCtx?.showModal) {
        notif.danger('Tidak dapat menghapus data cucian, silahkan coba lagi', {
          duration: 6666,
        });
        laundryServiceDelCtx.onCloseModal();
      }
    },
    () => {},
    [notif, deleteData, laundryServiceDelCtx]
  );

  const onLaundryServiceDelete = () => {
    laundryServiceDelCtx.onSetLoading(true);
    mutation.mutate(laundryService?.serviceId as string, {
      onSuccess(data) {
        laundryServiceDelCtx.onSetSuccess(true);
        laundryServiceDelCtx.onCloseModal();
        laundryServiceDelCtx.onSetLoading(false);
        notif.success(data?.message as string, { duration: 6666 });
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onError(error: any) {
        laundryServiceDelCtx.onCloseModal();
        notif.danger('Gagal menghapus data layanan! silahkan coba lagi', {
          duration: 6666,
        });
        laundryServiceDelCtx.onSetLoading(false);
        laundryServiceDelCtx.onSetError(error);
      },
    });
  };

  return (
    <Modal
      size="sm"
      show={laundryServiceDelCtx.showModal}
      onHide={() => {
        if (!laundryServiceDelCtx.isLoading) {
          laundryServiceDelCtx.onCloseModal();
        }
      }}
      backdrop="static"
      contentClassName="p-2 rounded-0"
    >
      <Modal.Header closeButton className="border-0 pb-0 ">
        <Modal.Title className="d-none">
          Hapus Layanan <strong>{laundryService?.serviceId || ''}</strong>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-flex">
        <div className="d-flex justify-content-center flex-column w-100 text-dark">
          {laundryServiceDelCtx.isLoading ? (
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
                Hapus data layanan
              </h3>
              <h4
                className="text-center text-gray fw-light "
                style={{ lineHeight: '1.4rem' }}
              >
                Anda yakin ingin menghapus data layanan dengan ID{' '}
                <strong>{laundryService?.serviceId || 'loading...'}</strong> ?
              </h4>
            </>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer className="pt-0 mt-0" style={{ border: '0px' }}>
        <div className="d-flex justify-content-center w-100 gap-2 ">
          {laundryServiceDelCtx.isLoading ? (
            <h4 className=" text-center text-secondary ">Harap Tunggu...</h4>
          ) : (
            <>
              <Button
                variant="slate"
                onClick={() => {
                  laundryServiceDelCtx.onCloseModal();
                }}
                className="px-4 rounded-0 text-dark "
              >
                Tidak
              </Button>
              <Button
                variant="danger"
                className="px-4 rounded-0 "
                onClick={() => onLaundryServiceDelete()}
                disabled={laundryServiceDelCtx.isLoading}
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

export default ModalConfirmDeleteLaundryService;
