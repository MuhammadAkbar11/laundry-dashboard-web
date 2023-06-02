import { Badge } from 'react-bootstrap';
import clsx from 'classnames';

type LQPayStatusBadgeProps = {
  value: string;
};

function LQPayStatusBadge({ value }: LQPayStatusBadgeProps): JSX.Element {
  const clsNm = clsx('p-2 rounded-0 d-flex align-items-center', {
    'bg-success': value?.trim() === 'FINISHED',
    'bg-warning text-dark': value?.trim() === 'PENDING',
  });

  let content: JSX.Element;

  if (value === 'FINISHED') {
    content = (
      <Badge className={clsNm}>
        <span className="p-1 bg-white rounded-circle " />
        <span className="ms-1">Sudah Bayar</span>
      </Badge>
    );
  } else {
    content = (
      <Badge className={clsNm}>
        {/* <FeatherIcon name="Circle" className="" size={12} /> */}
        <span className="p-1 bg-dark rounded-circle " />
        <span className="ms-1">Belum Bayar</span>
      </Badge>
    );
  }

  return <div className="d-inline-block">{content}</div>;
}

export default LQPayStatusBadge;
