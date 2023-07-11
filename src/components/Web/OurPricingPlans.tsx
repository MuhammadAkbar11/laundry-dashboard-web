import { Row } from 'react-bootstrap';
import CardPricingItem from '@components/Web/Cards/CardPricingItem';

interface PricingProps {
  title: string;
  price: string;
  features: string[];
  variant: 'accent1' | 'accent2';
}

function OurPricingPlan() {
  const pricingItems: PricingProps[] = [
    {
      variant: 'accent2',
      title: 'Paket Setrika',
      price: 'Rp 35.000',
      features: [
        '5 Kg Laundry',
        'Setrika Pakaian',
        'Gratis Ongkir',
        '3 Hari Selesai',
      ],
    },
    {
      variant: 'accent1',
      title: 'Paket Reguler',
      price: 'Rp 45.000',
      features: [
        '5 Kg Laundry',
        'Cuci Kering',
        'Setrika Pakaian',
        'Gratis Ongkir',
        '3 Hari Selesai',
      ],
    },
    {
      title: 'Paket Express',
      price: 'Rp 70.000',
      variant: 'accent2',
      features: [
        '5 Kg Laundry',
        'Cuci Kering',
        'Setrika Pakaian',
        'Gratis Ongkir',
        '1 Hari Selesai',
      ],
    },
  ];

  return (
    <div
      className="container-fluid pt-5 bg-white"
      style={{ paddingBottom: 100, paddingTop: 80 }}
    >
      <div className="container">
        <h6 className="text-accent2 text- text-center text-uppercase  fw-semibold mb-3">
          Paket Harga Kami
        </h6>
        <h1 className="mb-4 fw-extrabold text-accent1 text-center  display-4  ">
          Harga Terbaik
        </h1>
        <Row className="d-flex align-items-stretch">
          {pricingItems.map((item, index) => {
            const key = index;
            return (
              <CardPricingItem
                key={key}
                title={item.title}
                price={item.price}
                variant={item.variant}
                features={item.features}
              />
            );
          })}
        </Row>
      </div>
    </div>
  );
}

export default OurPricingPlan;
