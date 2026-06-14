import { Col, Card, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

interface StatisticCardProps {
  title: string;
  value: string;
  icon: IconProp;
}

export default function MemberStatisticCard({
  title,
  value,
  icon,
}: StatisticCardProps) {
  return (
    <Card className="shadow-none border border-slate">
      <Card.Body>
        <Row>
          <Col xs={8} className="mt-0">
            <Card.Title>{title}</Card.Title>
          </Col>
          <Col xs={4} className="col-auto">
            <div className="stat">
              <FontAwesomeIcon icon={icon} size="lg" className="align-middle" />
            </div>
          </Col>
        </Row>
        <h3 className="mt-1 fw-bold text-dark">{value}</h3>
      </Card.Body>
    </Card>
  );
}
