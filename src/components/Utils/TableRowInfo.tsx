import React from 'react';
import clsx from 'classnames';

type Props = {
  label: React.ReactNode;
  nowrapLabel?: boolean;
  value: React.ReactNode;
  seperator?: boolean;
};

function TableRowInfo({ label, value, seperator, nowrapLabel }: Props) {
  return (
    <tr>
      <td>
        <span className={clsx({ 'text-nowrap': nowrapLabel })}>{label}</span>
      </td>
      {seperator ? <td>:</td> : null}
      <td className="fw-bold">{value}</td>
    </tr>
  );
}

TableRowInfo.defaultProps = {
  seperator: true,
  nowrapLabel: false,
};

export default TableRowInfo;
