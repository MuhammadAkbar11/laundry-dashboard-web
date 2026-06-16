import { LucideIconTypes, ThemeTypes } from '@utils/types';
import React from 'react';
import { Card, Col, Placeholder, Row } from 'react-bootstrap';
import clsx from 'classnames';
import AppIcon from '../Icons/AppIcon';

type Props = {
  statTitle: string | number;
  statValue: string;
  statIcon: LucideIconTypes;
  statIconColor?: ThemeTypes;
  statDescription: string;
  statPercent: string;
  statPercentColor?: ThemeTypes;
  loading?: boolean;
};

function CardStats({
  statTitle,
  statValue,
  statIcon,
  statIconColor,
  statDescription,
  statPercent,
  statPercentColor,
  loading,
}: Props) {
  const statIconClsx = clsx('stat', {
    [`text-${statIconColor as string}`]: true,
  });

  const statPercentClsx = clsx({
    [`text-${statPercentColor as string}`]: true,
  });

  return (
    <Card className="h-100">
      <Card.Body>
        <Row>
          <Col className=" mt-0">
            <Card.Title as="h5" className="text-muted fs-6">
              {statTitle}
            </Card.Title>
          </Col>
          <Col xs="auto" className="col-auto">
            <div className={statIconClsx}>
              <AppIcon name={statIcon} className="align-middle" size={18} />
            </div>
          </Col>
        </Row>
        {loading ? (
          <Placeholder as="h1" animation="glow" className="mt-1 mb-3">
            <Placeholder xs={7} />
          </Placeholder>
        ) : (
          <h1 className="mt-1 mb-3">{statValue}</h1>
        )}
        {statPercent || statDescription ? (
          <div className="mb-0">
            {statPercent ? (
              <span className={statPercentClsx}>
                <i className="mdi mdi-arrow-bottom-right" /> {statPercent}
              </span>
            ) : null}
            <span className="text-muted ms-1">{statDescription}</span>
          </div>
        ) : null}
      </Card.Body>
    </Card>
  );
}

CardStats.defaultProps = {
  statIconColor: 'primary',
  statPercentColor: 'danger',
  loading: false,
} as Partial<Props>;

export default CardStats;
