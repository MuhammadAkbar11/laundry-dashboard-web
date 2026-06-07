import React, { useState } from 'react';
import { Card } from 'react-bootstrap';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

type Props = {};

function CardDatePicker({}: Props) {
  const [selected, setSelected] = useState<Date>();

  return (
    <Card className="flex-fill">
      <Card.Header className="bg-light">
        <Card.Title as="h5" className=" mb-0">
          Kalender
        </Card.Title>
      </Card.Header>
      <Card.Body className="card-body d-flex justify-content-center">
        <DayPicker mode="single" selected={selected} onSelect={setSelected} />
      </Card.Body>
    </Card>
  );
}

export default CardDatePicker;
