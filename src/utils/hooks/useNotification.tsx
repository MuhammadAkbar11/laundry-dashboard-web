import toast, { ToastOptions } from 'react-hot-toast';

type Props = {
  duration?: number;
};

function useNotification(props?: Partial<Props>) {
  const duration = props?.duration;
  const primary = (msg: string, options?: Partial<ToastOptions>) => {
    toast(msg, {
      duration,
      icon: 'primary',
      ...options,
    });
  };

  const success = (msg: string, options?: Partial<ToastOptions>) => {
    toast.success(msg, {
      duration,
      icon: 'success',
      ...options,
    });
  };

  const danger = (msg: string, options?: Partial<ToastOptions>) => {
    toast.error(msg, {
      duration,
      icon: 'danger',
      ...options,
    });
  };

  const info = (msg: string, options?: Partial<ToastOptions>) => {
    toast.error(msg, {
      duration,
      icon: 'info',
      ...options,
    });
  };

  const warning = (msg: string, options?: Partial<ToastOptions>) => {
    toast.error(msg, {
      duration,
      icon: 'warning',
      ...options,
    });
  };

  return { primary, success, danger, info, warning };
}

useNotification.defaultProps = {
  duration: 10000,
} as Props;

export default useNotification;
