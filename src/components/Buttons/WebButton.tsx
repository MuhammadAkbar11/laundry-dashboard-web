/* eslint-disable react/default-props-match-prop-types */
/* eslint-disable react/display-name */
import React from 'react';
import { Button, ButtonProps, Spinner } from 'react-bootstrap';
import clsx from 'classnames';

interface WebButtonProps extends ButtonProps {
  isLoading?: boolean;
  children?: React.ReactNode;
}

const WebButton = React.forwardRef<HTMLButtonElement, WebButtonProps>(
  (props, ref) => {
    const { children, className, isLoading, disabled, ...restProps } = props;

    const [btnDisabled, setBtnDisabled] = React.useState(disabled || false);

    const clsnm = clsx('py-md-3 px-md-5', className);

    React.useEffect(() => {
      if (isLoading) {
        setBtnDisabled(true);
      } else {
        setBtnDisabled(disabled as boolean);
      }
    }, [isLoading, disabled]);

    const iconLoading = isLoading ? (
      <span className={children !== null ? 'ms-2' : ''}>
        <Spinner size="sm" />
      </span>
    ) : null;

    return (
      <Button ref={ref} className={clsnm} disabled={btnDisabled} {...restProps}>
        {children}
        {iconLoading}
      </Button>
    );
  }
);

WebButton.defaultProps = {
  isLoading: false,
  children: null,
};

export default WebButton;
