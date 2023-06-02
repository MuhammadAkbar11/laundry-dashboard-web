import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';

interface ShowMoreProps {
  initialText: string;
  openedText?: string;
  children: React.ReactNode;
}

function ShowMore({ openedText, initialText, children }: ShowMoreProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Collapse in={open}>
        <div id="show-more-collapse">{children}</div>
      </Collapse>
      <Button
        size="sm"
        variant="link"
        onClick={() => setOpen(!open)}
        aria-controls="show-more-collapse"
        aria-expanded={open}
        className="text-nowrap d-flex gap-1 p-0 "
      >
        {!open ? initialText : openedText}
      </Button>
    </>
  );
}

ShowMore.defaultProps = {
  openedText: 'Sembunyikan',
};

export default ShowMore;
