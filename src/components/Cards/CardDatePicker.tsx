import React, { useState } from 'react';
import { Card } from 'react-bootstrap';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

type Props = {};

function CardDatePicker({}: Props) {
  const [selected, setSelected] = useState<Date>();

  return (
    <Card className="h-100">
      <Card.Header className="bg-light">
        <Card.Title as="h5" className="mb-0">
          Kalender
        </Card.Title>
      </Card.Header>
      <Card.Body className="d-flex flex-column">
        <div className="d-flex align-items-center  justify-content-center w-100">
          <DayPicker
            className="w-100"
            style={{ margin: 0 }}
            mode="single"
            selected={selected}
            onSelect={setSelected}
          />
        </div>
        <div className="d-flex flex-column align-items-center justify-content-center border-top pt-3 mt-3">
          <span className="text-muted small">Tanggal dipilih</span>
          <strong className="mt-1">
            {selected?.toLocaleDateString('id-ID', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            }) || 'Belum dipilih'}
          </strong>
        </div>
      </Card.Body>
    </Card>
  );
}

export default CardDatePicker;
