import Link from 'next/link';
import clsx from 'classnames';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Col, Container, Row } from 'react-bootstrap';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';

type History = {
  href?: string;
  disabled: boolean;
  name: string;
};

type Props = {
  title: string;
  history: History[];
  size?: 'lg' | 'sm';
};

function PageHeader({ title, history, size }: Props) {
  return (
    <div className="page-header font-opensans container-fluid bg-accent2 pt-2 pt-lg-5 pb-2 ">
      <Container
        className={clsx('container px-lg-3', {
          'py-5': size === 'lg',
          'py-3': size === 'sm',
        })}
      >
        <Row
          className={clsx('align-items-center  ', {
            'py-4': size === 'lg',
            'py-3': size === 'sm',
          })}
        >
          <Col md={6} className=" text-center text-md-start  ">
            <h1
              className={clsx('mb-md-0 text-white fw-bolder ', {
                'display-6 ': size === 'lg',
              })}
            >
              {title}
            </h1>
          </Col>
          <Col md={6} className=" text-center text-md-end">
            <div className="d-inline-flex align-items-center">
              <Link
                className="btn text-white font-opensans rounded-0 border-0 shadow-none"
                href="/"
                style={{ fontSize: 17 }}
              >
                Home
              </Link>
              {history.map((hs, idx) => {
                const key = idx;
                return (
                  <React.Fragment key={key}>
                    <FontAwesomeIcon
                      icon={faAngleRight}
                      className="text-white"
                    />
                    {hs.disabled ? (
                      <span
                        className="btn font-opensans text-white disabled rounded-0 border-0 shadow-none"
                        style={{ fontSize: 17 }}
                      >
                        {hs.name}
                      </span>
                    ) : (
                      <Link
                        className="btn text-white rounded-0 font-opensans border-0 shadow-none"
                        href={(hs.href as string) || ''}
                        style={{ fontSize: 17 }}
                      >
                        {hs.name}
                      </Link>
                    )}
                  </React.Fragment>
                );
              })}
              {/* */}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

PageHeader.defaultProps = {
  size: 'lg',
};

export default PageHeader;
