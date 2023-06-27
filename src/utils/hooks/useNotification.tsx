import toast, { ToastOptions } from 'react-hot-toast';

type Props = {
  duration?: number;
};

function useNotification(props?: Partial<Props>) {
  const duration = props?.duration;
  const primary = (msg: string, options?: Partial<ToastOptions>) => {
    return toast(msg, {
      duration,
      icon: 'primary',
      ...options,
    });
  };

  const success = (msg: string, options?: Partial<ToastOptions>) => {
    return toast.success(msg, {
      duration,
      icon: 'success',
      ...options,
    });
  };

  const danger = (msg: string, options?: Partial<ToastOptions>) => {
    return toast.error(msg, {
      duration,
      icon: 'danger',
      ...options,
    });
  };

  const info = (msg: string, options?: Partial<ToastOptions>) => {
    return toast.error(msg, {
      duration,
      icon: 'info',
      ...options,
    });
  };

  const warning = (msg: string, options?: Partial<ToastOptions>) => {
    return toast.error(msg, {
      duration,
      icon: 'warning',
      ...options,
    });
  };

  const dismiss = (id: string) => toast.dismiss(id);
  const remove = (id: string) => toast.remove(id);

  return { primary, success, danger, info, warning, dismiss, remove };
}

useNotification.defaultProps = {
  duration: 6666,
} as Props;

export default useNotification;
