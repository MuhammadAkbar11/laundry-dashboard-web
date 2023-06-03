/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Modal, Spinner, Table } from 'react-bootstrap';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useQuery } from '@tanstack/react-query';
// import useNotification from '@hooks/useNotification';
import { useLaundryQueueDetailContext } from '@utils/context/Laundry/LaundryQueue/LaundryQueueDetailContext';
import { getDetailLaundryQueueService } from '@services/laundryQueueService';
import { uDate } from '@utils/utils';
import BoxButton from '@components/Buttons/BoxButton';
import Link from 'next/link';
// import useEffectRun from '@hooks/useEffectRan';

function ModalDetailLaundryQueue() {
  const detailCtx = useLaundryQueueDetailContext();

  // const notif = useNotification();

  // const queryClient = useQueryClient();
  // const mutation = useMutation(deleteLaundryQueueService, {
  //   onSettled: () => {
  //     queryClient.invalidateQueries({
  //       queryKey: deleteData?.fetchQueryKey,
  //     });
  //   },
  // });

  // useEffectRun(
  //   () => {
  //     if (!deleteData?.laundryQueueId && laundryQueueDelCtx?.showModal) {
  //       notif.danger('Tidak dapat menghapus data antrian, silahkan coba lagi', {
  //         duration: 6666,
  //       });
  //       laundryQueueDelCtx.onCloseModal();
  //     }
  //   },
  //   () => {},
  //   [notif, deleteData, laundryQueueDelCtx]
  // );

  // const onLaundryQueueDelete = () => {
  //   laundryQueueDelCtx.onSetLoading(true);
  //   mutation.mutate(deleteData?.laundryQueueId as string, {
  //     onSuccess(data) {
  //       laundryQueueDelCtx.onSetSuccess(true);
  //       laundryQueueDelCtx.onCloseModal();
  //       laundryQueueDelCtx.onSetLoading(false);
  //       notif.success(data?.message as string, { duration: 6666 });
  //     },
  //     onError(error: any) {
  //       laundryQueueDelCtx.onCloseModal();
  //       notif.danger('Gagal menghapus data antarian! silahkan coba lagi', {
  //         duration: 6666,
  //       });
  //       laundryQueueDelCtx.onSetLoading(false);
  //       laundryQueueDelCtx.onSetError(error);
  //     },
  //   });
  // };

  const dataQuery = useQuery(
    [
      'laundry-queue-detail',
      { laundryQueueId: detailCtx.data?.laundryQueueId },
    ],
    () =>
      getDetailLaundryQueueService(detailCtx.data?.laundryQueueId as string),
    {
      enabled: !!detailCtx.data?.laundryQueueId,
    }
  );

  const laundryQueue = React.useMemo(() => dataQuery.data, [dataQuery]);

  return (
    <Modal
      show={detailCtx.isOpen}
      onHide={() => {
        if (!dataQuery.isLoading) {
          detailCtx.onClose();
        }
      }}
      contentClassName="p-2 rounded-0"
    >
      <Modal.Header closeButton className="border-0 pb-0 ">
        <Modal.Title>
          Detail Antrian <strong>{laundryQueue?.laundryQueueId || ''}</strong>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-flex">
        <div className="d-flex justify-content-center flex-column w-100 text-dark">
          {dataQuery.isLoading ? (
            <div
              className="text-center py-3"
              style={{ transform: 'scale(2)', fontSize: 18 }}
            >
              <Spinner animation="border" role="status" variant="secondary">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : (
            <Table bordered>
              <tbody>
                <tr>
                  <td>Pelanggan</td>
                  <td className="fw-bold">
                    {laundryQueue?.customer === undefined
                      ? 'Dihapus'
                      : laundryQueue?.customer?.name}
                  </td>
                </tr>
                <tr>
                  <td>Waktu Registrasi</td>
                  <td className="fw-bold">{uDate(laundryQueue?.createdAt)}</td>
                </tr>
                <tr>
                  <td>Status Cucian</td>
                  <td className="fw-bold">
                    {laundryQueue?.status === 'ONHOLD' ? (
                      <span>Proses (Sedang dalam antrian ke laundry room)</span>
                    ) : null}
                    {laundryQueue?.status === 'WASHED' ? (
                      <span>
                        Sedang cuci (Cucian sedang di ke laundry room)
                      </span>
                    ) : null}
                    {laundryQueue?.status === 'FINISHED'
                      ? laundryQueue?.deliveryAt === null && (
                          <span>Selesai (Cucian sudah selesai)</span>
                        )
                      : null}
                    {laundryQueue?.status === 'FINISHED'
                      ? laundryQueue?.deliveryAt !== null && (
                          <span>
                            Selesai &amp; Diambil (Cucian sudah selesai dan
                            diambil oleh pelanggan)
                          </span>
                        )
                      : null}
                  </td>
                </tr>
                <tr>
                  <td>Total Cucian</td>
                  <td className="fw-bold">
                    {laundryQueue?._count?.laundries || 0}
                  </td>
                </tr>
                <tr>
                  <td>Status Pembayaran</td>
                  <td className="fw-bold">
                    {laundryQueue?.queuePaymentStatus === 'PENDING' ? (
                      <span className="badge bg-danger p-2 rounded-0">
                        Belum
                      </span>
                    ) : (
                      <span className="badge bg-success p-2 rounded-0">
                        Sudah
                      </span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td>Jenis Pengiriman</td>
                  <td className="fw-bold">
                    {laundryQueue?.deliveryType === 'PICKUP' ? (
                      <>
                        <span className="me-1">Di Ambil / Pickup</span>(
                        {laundryQueue?.deliveryAt === null ? (
                          <span className="text-danger fst-italic ">
                            (Belum di ambil)
                          </span>
                        ) : (
                          <span className="text-danger fst-italic ">
                            (Sudah di ambil)
                          </span>
                        )}
                      </>
                    ) : (
                      <>
                        <span className="me-1">Di Antarkan</span>
                        {laundryQueue?.deliveryAt === null ? (
                          <span className="text-danger fst-italic ">
                            (belum di antar)
                          </span>
                        ) : (
                          <span className="text-danger fst-italic ">
                            (Sudah di antar)
                          </span>
                        )}
                      </>
                    )}
                  </td>
                </tr>

                <tr>
                  <td>Catatan</td>
                  <td className="fw-bold">{laundryQueue?.note}</td>
                </tr>
              </tbody>
            </Table>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer className="pt-0 mt-0 " style={{ border: '0px' }}>
        <div className=" d-flex  justify-content-between w-100">
          <div className="d-flex justify-content-start w-100 gap-2 ">
            <BoxButton
              variant="success"
              // onClick={() => onLaundryQueueDelete()}
              disabled={
                dataQuery.isLoading ||
                laundryQueue?._count?.laundries === 0 ||
                laundryQueue?.queuePaymentStatus === 'FINISHED'
              }
              icon="DollarSign"
            >
              Bayar
            </BoxButton>
            <BoxButton
              variant="success"
              // onClick={() => onLaundryQueueDelete()}
              disabled={
                dataQuery.isLoading ||
                laundryQueue?.queuePaymentStatus !== 'FINISHED' ||
                laundryQueue?.status !== 'FINISHED' ||
                laundryQueue?.deliveryAt !== null
              }
              icon="CheckCircle"
            >
              Set Sudah{' '}
              {laundryQueue?.deliveryType === 'PICKUP' ? 'Diambil' : 'Diantar'}
            </BoxButton>
          </div>
          <div>
            <Link
              passHref
              href={`/laundry/room/${laundryQueue?.laundryRooms?.laundryRoomId}`}
            >
              <BoxButton
                as="a"
                href={`/laundry/room/${laundryQueue?.laundryRooms?.laundryRoomId}`}
                icon="ArrowRight"
                iconPos="end"
                className="text-nowrap"
                disabled={dataQuery.isLoading}
              >
                Ke Laundry Room
              </BoxButton>
            </Link>
          </div>
        </div>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalDetailLaundryQueue;
