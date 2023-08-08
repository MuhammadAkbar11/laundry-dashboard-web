/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Modal, Spinner, Table } from 'react-bootstrap';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useNotification from '@hooks/useNotification';
import { useLaundryQueueDetailContext } from '@utils/context/Laundry/LaundryQueue/LaundryQueueDetailContext';
import {
  getDetailLaundryQueueService,
  updateLaundryQueueDeliveredService,
} from '@services/laundryQueueService';
import { uDate } from '@utils/utils';
import BoxButton from '@components/Buttons/BoxButton';
import Link from 'next/link';
import PaymentStatusText from '@components/Typography/PaymentStatusText';
// import useEffectRun from '@hooks/useEffectRan';

function ModalDetailLaundryQueue() {
  const detailCtx = useLaundryQueueDetailContext();

  const notif = useNotification();

  const dataQuery = useQuery(
    ['laundryQueueDetail', { laundryQueueId: detailCtx.data?.laundryQueueId }],
    () =>
      getDetailLaundryQueueService(detailCtx.data?.laundryQueueId as string),
    {
      enabled: !!detailCtx.data?.laundryQueueId,
    }
  );

  const laundryQueue = React.useMemo(() => dataQuery.data, [dataQuery]);
  const queryClient = useQueryClient();
  const mutationUpdateDelivered = useMutation(
    updateLaundryQueueDeliveredService,
    {
      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: [
            'laundryQueueDetail',
            { laundryQueueId: detailCtx?.data?.laundryQueueId },
          ],
        });
        queryClient.invalidateQueries({
          queryKey: detailCtx?.data?.fetchQueryKey,
        });
      },
    }
  );

  const onLaundryQueueDelivered = () => {
    detailCtx.onSetLoading(true);

    mutationUpdateDelivered.mutate(detailCtx?.data?.laundryQueueId as string, {
      onSuccess(data) {
        detailCtx.onSetLoading(false);
        notif.success(data?.message as string, { duration: 6666 });
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onError() {
        notif.danger('Gagal mengubah data antarian! silahkan coba lagi', {
          duration: 6666,
        });
        detailCtx.onSetLoading(false);
      },
    });
  };

  return (
    <Modal
      show={detailCtx.isOpen}
      onHide={() => {
        if (!dataQuery.isLoading) {
          detailCtx.onClose();
        }
      }}
      contentClassName="p-2 rounded-0"
      backdrop="static"
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
                  <td>
                    Waktu{' '}
                    {laundryQueue?.deliveryType === 'PICKUP'
                      ? 'Penyerahan'
                      : 'Penjemputan'}
                  </td>
                  <td className="fw-bold">{uDate(laundryQueue?.pickupAt)}</td>
                </tr>
                <tr>
                  <td>Status </td>
                  <td className="fw-bold">
                    {laundryQueue?.status === 'ONHOLD' ? (
                      <span>Proses (Sedang dalam antrian ke laundry room)</span>
                    ) : null}
                    {laundryQueue?.status === 'PENDING' ? (
                      <span>Menunggu (Menunggu konfirmasi pemesanan)</span>
                    ) : null}
                    {laundryQueue?.status === 'CANCELED' ? (
                      <span>Batal (Antrian di batalkan atau di tolak)</span>
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
                    <PaymentStatusText
                      colored
                      value={laundryQueue?.queuePaymentStatus || 'PENDING'}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Jenis Pengiriman</td>
                  <td className="fw-bold">
                    {laundryQueue?.deliveryType === 'PICKUP' ? (
                      <>
                        <span className="me-1">Self Pickup</span>
                        {laundryQueue?.deliveryAt === null ? (
                          <span className="text-danger fst-italic ">
                            (Belum di ambil)
                          </span>
                        ) : (
                          <span className="text-success fst-italic ">
                            (Sudah di ambil)
                          </span>
                        )}
                      </>
                    ) : (
                      <>
                        <span className="me-1">Delivery / Jemput-Antar</span>
                        {laundryQueue?.deliveryAt === null ? (
                          <span className="text-danger fst-italic ">
                            (belum di antar)
                          </span>
                        ) : (
                          <span className="text-success fst-italic ">
                            (Sudah di antar)
                          </span>
                        )}
                      </>
                    )}
                  </td>
                </tr>
                {laundryQueue?.deliveryType === 'DELIVERED' ? (
                  <tr>
                    <td>Alamat</td>
                    <td className="fw-bold">{laundryQueue?.deliveryAddress}</td>
                  </tr>
                ) : null}

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
              onClick={() => onLaundryQueueDelivered()}
              disabled={
                dataQuery.isLoading ||
                laundryQueue?.queuePaymentStatus !== 'FINISHED' ||
                laundryQueue?.status !== 'FINISHED' ||
                laundryQueue?.deliveryAt !== null
              }
              isLoading={mutationUpdateDelivered.isLoading}
              icon="CheckCircle"
            >
              Set Sudah{' '}
              {laundryQueue?.deliveryType === 'PICKUP' ? 'Diambil' : 'Diantar'}
            </BoxButton>
          </div>
          <div>
            {laundryQueue?.status !== 'PENDING' ? (
              <Link
                passHref
                legacyBehavior
                href={`/admin/laundry/room/${laundryQueue?.laundryRoom?.laundryRoomId}`}
              >
                <BoxButton
                  icon="ArrowRight"
                  iconPos="end"
                  variant="slate"
                  className="text-dark text-nowrap "
                  disabled={dataQuery.isLoading}
                >
                  Ke Laundry Room
                </BoxButton>
              </Link>
            ) : null}
          </div>
        </div>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalDetailLaundryQueue;
