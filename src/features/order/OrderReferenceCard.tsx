import React from 'react';
import { Button, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faCheck } from '@fortawesome/free-solid-svg-icons';
import useNotification from '@hooks/useNotification';

type Props = {
  orderNumber: string;
};

function OrderReferenceCard({ orderNumber }: Props) {
  const notif = useNotification();
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(orderNumber);
      setCopied(true);
      notif.success('Nomor pesanan disalin');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      notif.danger('Gagal menyalin nomor pesanan');
    }
  };

  return (
    <Card className="order-reference-card border-0 text-center">
      <Card.Body className="py-3">
        <p className="text-muted small mb-1">Nomor Pesanan</p>
        <div className="d-flex align-items-center justify-content-center gap-2">
          <span className="order-reference-number fw-bolder text-accent1">
            {orderNumber}
          </span>
          <Button
            variant="outline-accent1"
            size="sm"
            aria-label="Salin nomor pesanan"
            onClick={handleCopy}
          >
            <FontAwesomeIcon icon={copied ? faCheck : faCopy} />
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

export default OrderReferenceCard;
