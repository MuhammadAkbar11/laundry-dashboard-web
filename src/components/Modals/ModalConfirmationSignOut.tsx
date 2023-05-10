/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Button, Modal, Spinner } from 'react-bootstrap';
import { useAdminLayoutContext } from '@utils/context/AdminLayoutContext';
import { useMutation } from '@tanstack/react-query';
import { postSignOutService } from '@/services/authSevices';
import useNotification from '@hooks/useNotification';
import useRouteChangeHandlers from '@hooks/useRouteChangeHandlers';

function ModalConfirmationSignOut() {
  const adminLayoutCtx = useAdminLayoutContext();

  const [loading, setLoading] = React.useState(false);

  const mutation = useMutation(postSignOutService);
  const notif = useNotification();

  useRouteChangeHandlers({
    routeChangeComplete: () => {
      setLoading(false);
      adminLayoutCtx.onCloseModalSignOut();
    },
    routeChangeError: () => {
      setLoading(false);
    },
    unsubRouteChangeComplete: false,
    unsubRouteChangeError: false,
  });

  const onSignOut = () => {
    setLoading(true);
    mutation.mutate(
      {},
      {
        onSuccess() {
          window.location.reload();
        },
        onError() {
          adminLayoutCtx.onToggleModalSignOut();
          notif.danger('Logout gagal! silahkan coba lagi', {
            duration: 10000,
          });
          setLoading(false);
        },
      }
    );
  };

  return (
    <Modal
      size="sm"
      show={adminLayoutCtx.openModalSignOut}
      onHide={() => {
        if (!loading) adminLayoutCtx.onToggleModalSignOut();
      }}
      contentClassName="p-2"
    >
      <Modal.Header closeButton className="border-0 pb-0 ">
        <Modal.Title className="d-none">Logout</Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-flex">
        <div className="d-flex justify-content-center flex-column w-100 text-dark">
          {loading ? (
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
                Logout
              </h3>
              <h4 className="text-center text-gray fw-light  ">
                Anda yakin ingin logout?
              </h4>
            </>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer className="pt-0 mt-0" style={{ border: '0px' }}>
        <div className="d-flex justify-content-center w-100 gap-2 ">
          {loading ? (
            <h4 className=" text-center text-secondary ">Harap Tunggu...</h4>
          ) : (
            <>
              <Button
                variant="secondary"
                onClick={() => adminLayoutCtx.onToggleModalSignOut()}
                className="px-4"
              >
                Tidak
              </Button>
              <Button
                variant="primary"
                className="px-4"
                onClick={() => onSignOut()}
                disabled={loading}
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

export default ModalConfirmationSignOut;
