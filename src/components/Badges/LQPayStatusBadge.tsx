import { Badge } from 'react-bootstrap';
import clsx from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDotCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

type LQPayStatusBadgeProps = {
  value: string;
};

function LQPayStatusBadge({ value }: LQPayStatusBadgeProps): JSX.Element {
  const clsNm = clsx('p-2 rounded-0 d-flex align-items-center', {
    'bg-success': value?.trim() === 'FINISHED',
    'bg-warning text-dark': value?.trim() === 'PENDING',
    'bg-danger': value?.trim() === 'REJECTED',
    'bg-info': value?.trim() === 'PROCESSED',
  });

  let content: JSX.Element;

  if (value === 'FINISHED') {
    content = (
      <Badge className={clsNm}>
        <FontAwesomeIcon
          icon={faDotCircle}
          style={{
            fontSize: 8,
          }}
          className="bg-white rounded-circle"
        />
        <span className="ms-1">Lunas</span>
      </Badge>
    );
  } else if (value === 'REJECTED') {
    content = (
      <Badge className={clsNm}>
        <FontAwesomeIcon
          style={{
            fontSize: 8,
          }}
          icon={faTimesCircle}
          className=" bg-white rounded-circle"
        />
        <span className="ms-1">Ditolak</span>
      </Badge>
    );
  } else if (value === 'PENDING') {
    content = (
      <Badge className={clsNm}>
        <FontAwesomeIcon
          style={{
            fontSize: 8,
          }}
          icon={faDotCircle}
          className=" bg-dark rounded-circle"
        />
        <span className="ms-1">Belum Bayar</span>
      </Badge>
    );
  } else if (value === 'PROCESSED') {
    content = (
      <Badge className={clsNm}>
        <FontAwesomeIcon
          style={{
            fontSize: 8,
          }}
          icon={faDotCircle}
          className=" bg-dark rounded-circle"
        />
        <span className="ms-1">Diproses</span>
      </Badge>
    );
  } else {
    content = (
      <Badge className={clsNm}>
        <FontAwesomeIcon
          style={{
            fontSize: 8,
          }}
          icon={faDotCircle}
          className=" bg-secondary rounded-circle"
        />
        <span className="ms-1 text-capitalize">
          {value.toLocaleLowerCase()}
        </span>
      </Badge>
    ); // Add your fallback content here if needed
  }

  return <div className="d-inline-block">{content}</div>;
}

export default LQPayStatusBadge;
