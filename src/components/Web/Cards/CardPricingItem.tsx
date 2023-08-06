import Link from 'next/link';
import clsx from 'classnames';
import { Col } from 'react-bootstrap';
import WebButton from '@components/Buttons/WebButton';
import useMemberAuth from '@hooks/useMemberAuth';

interface PricingProps {
  title: string;
  price: string;
  features: string[];
  variant?: 'accent1' | 'accent2';
}

function CardPricingItem({ title, price, features, variant }: PricingProps) {
  const { authState: profile, isLoading: authLoading } = useMemberAuth();

  return (
    <Col lg={4} mb={4}>
      <div className="bg-light text-center font-opensans mb-2 py-4 h-100  d-flex flex-column align-content-between justify-content-center align-items-center ">
        <div
          className={clsx(
            'd-inline-flex flex-column align-items-center justify-content-center rounded-circle shadow mt-2 mb-4',
            {
              ' bg-accent2': variant === 'accent2',
              ' bg-accent1': variant === 'accent1',
            }
          )}
          style={{
            width: '200px',
            height: '200px',
            border: '15px solid #ffffff',
          }}
        >
          <h4 className="text-white fw-bold text-uppercase ">{title}</h4>
          <h3 className=" text-white mb-0  ">
            <span>{price}</span>
            {/* <small
              className="align-bottom"
              style={{ fontSize: '16px', lineHeight: '40px' }}
            >
              / KG
            </small> */}
          </h3>
        </div>
        <div className="d-flex flex-column align-items-center mb-auto py-2">
          {features.map((feature, index) => {
            const key = index;
            return <p key={key}>{feature}</p>;
          })}
        </div>
        <div className="d-flex mt-auto justify-content-center ">
          {authLoading ? (
            <Link passHref legacyBehavior href="/daftar">
              <WebButton
                variant={variant}
                className="py-2 px-4 font-opensans text-uppercase "
              >
                Daftar Sekarang
              </WebButton>
            </Link>
          ) : null}
          {!authLoading && profile ? (
            <Link passHref legacyBehavior href="/pemesanan">
              <WebButton
                variant={variant}
                className="py-2 px-4 font-opensans text-uppercase "
              >
                Pesan Sekarang
              </WebButton>
            </Link>
          ) : null}
        </div>
      </div>
    </Col>
  );
}

CardPricingItem.defaultProps = {
  variant: 'accent2',
};

export default CardPricingItem;
