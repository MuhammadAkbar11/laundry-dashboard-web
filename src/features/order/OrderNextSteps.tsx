import React from 'react';
import { Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faCircle, faBan } from '@fortawesome/free-solid-svg-icons';
import clsx from 'classnames';

type Props = {
  status?: string;
  deliveryType?: string;
  deliveredAt?: string | null;
};

// Maps the laundry queue status to the current step index in the timeline.
function resolveCurrentStep(status?: string, delivered?: boolean): number {
  switch (status) {
    case 'PENDING':
      return 1;
    case 'ONHOLD':
    case 'WASHED':
      return 2;
    case 'FINISHED':
      return delivered ? 4 : 3;
    default:
      return 1;
  }
}

function OrderNextSteps({ status, deliveryType, deliveredAt }: Props) {
  const isCanceled = status === 'CANCELED';
  const delivered = Boolean(deliveredAt);
  const current = resolveCurrentStep(status, delivered);

  const steps = [
    { title: 'Pesanan Diterima', desc: 'Pesanan Anda berhasil dibuat.' },
    { title: 'Menunggu Diproses', desc: 'Pesanan menunggu untuk diproses.' },
    { title: 'Proses Pencucian', desc: 'Cucian Anda sedang dikerjakan.' },
    { title: 'Cucian Selesai', desc: 'Cucian selesai dan siap dilanjutkan.' },
    {
      title:
        deliveryType === 'DELIVERED' ? 'Antar Jemput' : 'Pengambilan Cucian',
      desc:
        deliveryType === 'DELIVERED'
          ? 'Cucian akan diantar ke alamat Anda.'
          : 'Cucian dapat diambil di outlet.',
    },
  ];

  return (
    <Card className="shadow-none border h-100">
      <Card.Header className="bg-light">
        <Card.Title className="mb-0 text-accent1">
          Langkah Selanjutnya
        </Card.Title>
      </Card.Header>
      <Card.Body>
        {isCanceled ? (
          <div className="d-flex align-items-center gap-2 text-danger">
            <FontAwesomeIcon icon={faBan} />
            <span className="fw-semibold">Pesanan dibatalkan.</span>
          </div>
        ) : (
          <ul className="order-timeline list-unstyled mb-0">
            {steps.map((step, idx) => {
              const done = idx < current;
              const active = idx === current;
              return (
                <li
                  key={step.title}
                  className={clsx('order-timeline-item d-flex gap-3', {
                    'is-done': done,
                    'is-active': active,
                  })}
                >
                  <div className="order-timeline-marker d-flex flex-column align-items-center">
                    <span className="order-timeline-dot d-flex align-items-center justify-content-center rounded-circle">
                      <FontAwesomeIcon
                        icon={done ? faCheck : faCircle}
                        size={done ? '1x' : 'xs'}
                      />
                    </span>
                  </div>
                  <div className="pb-3">
                    <p className="mb-0 fw-semibold text-dark">{step.title}</p>
                    <p className="mb-0 small text-muted">{step.desc}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Card.Body>
    </Card>
  );
}

OrderNextSteps.defaultProps = {
  status: 'PENDING',
  deliveryType: 'PICKUP',
  deliveredAt: null,
};

export default OrderNextSteps;
