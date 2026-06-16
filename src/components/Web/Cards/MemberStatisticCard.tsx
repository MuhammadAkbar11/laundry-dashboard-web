import { Col, Card, Row, Placeholder } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

interface StatisticCardProps {
  title: string;
  value: string | number;
  icon: IconProp;
  loading?: boolean;
}

export default function MemberStatisticCard({
  title,
  value,
  icon,
  loading,
}: StatisticCardProps) {
  return (
    <Card className="shadow-none border border-slate h-100">
      <Card.Body>
        <Row>
          <Col xs={8} className="mt-0">
            <Card.Title className="text-muted fs-6">{title}</Card.Title>
          </Col>
          <Col xs={4} className="col-auto">
            <div className="stat">
              <FontAwesomeIcon icon={icon} size="lg" className="align-middle" />
            </div>
          </Col>
        </Row>
        {loading ? (
          <Placeholder as="h3" animation="glow" className="mt-1 mb-0">
            <Placeholder xs={6} />
          </Placeholder>
        ) : (
          <h3 className="mt-1 fw-bold text-dark mb-0">{value}</h3>
        )}
      </Card.Body>
    </Card>
  );
}

MemberStatisticCard.defaultProps = {
  loading: false,
};
