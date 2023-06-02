/* eslint-disable react/default-props-match-prop-types */
/* eslint-disable react/display-name */
import React from 'react';
import { Button, ButtonProps, Spinner } from 'react-bootstrap';
import clsx from 'classnames';
import { FeatherIconsTypes } from '@utils/types';
import FeatherIcon from '@components/Icons/FeatherIcon';

interface BoxButtonProps extends ButtonProps {
  isLoading?: boolean;
  icon?: FeatherIconsTypes | null;
  iconPos?: 'start' | 'end';
  children: React.ReactNode;
}

const BoxButton = React.forwardRef<HTMLButtonElement, BoxButtonProps>(
  (props, ref) => {
    const {
      children,
      className,
      icon,
      iconPos,
      isLoading,
      disabled,
      ...restProps
    } = props;

    const [btnDisabled, setBtnDisabled] = React.useState(disabled || false);

    const clsnm = clsx('rounded-0', className);

    let buttonIcon = null;

    if (!isLoading && icon) {
      buttonIcon = (
        <span
          className={clsx('d-inline-block', {
            'me-2': iconPos === 'start',
            'ms-2': iconPos === 'end',
          })}
          style={{ transform: 'translateY(-2px)' }}
        >
          <FeatherIcon name={icon} />
        </span>
      );
    }

    React.useEffect(() => {
      if (isLoading) {
        setBtnDisabled(true);
      } else {
        setBtnDisabled(disabled as boolean);
      }
    }, [isLoading, disabled]);

    return (
      <Button ref={ref} className={clsnm} disabled={btnDisabled} {...restProps}>
        {isLoading ? (
          <span className="me-2  ">
            <Spinner size="sm" />
          </span>
        ) : null}
        {iconPos === 'start' ? buttonIcon : null}
        {children}
        {iconPos === 'end' ? buttonIcon : null}
      </Button>
    );
  }
);

BoxButton.defaultProps = {
  icon: null,
  isLoading: false,
  iconPos: 'start',
};

export default BoxButton;
