import React from 'react';

type Props = {
  label: React.ReactNode;
  value: React.ReactNode;
  seperator?: boolean;
};

function TableRowInfo({ label, value, seperator }: Props) {
  return (
    <tr>
      <td>{label}</td>
      {seperator ? <td>:</td> : null}
      <td className="fw-bold">{value}</td>
    </tr>
  );
}

TableRowInfo.defaultProps = {
  seperator: true,
};

export default TableRowInfo;
