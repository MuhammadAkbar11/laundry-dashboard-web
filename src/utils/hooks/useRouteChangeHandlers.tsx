/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

type Props = {
  routeChangeStart?: () => void;
  routeChangeComplete: (routeUrl: any) => void;
  routeChangeError: () => void;
  unsubRouteChangeStart?: boolean;
  unsubRouteChangeComplete?: boolean;
  unsubRouteChangeError?: boolean;
};

function useRouteChangeHandlers({
  routeChangeStart,
  routeChangeComplete,
  routeChangeError,
  unsubRouteChangeStart = true,
  unsubRouteChangeComplete = true,
  unsubRouteChangeError = true,
}: Props) {
  const router = useRouter();
  const effRan = useRef(false);

  useEffect(() => {
    if (effRan.current === false) {
      const handleRouteChangeStart = () => {
        if (routeChangeStart) {
          routeChangeStart();
        }
      };
      const handleRouteChangeComplete = (routeUrl: any) => {
        if (routeChangeComplete) {
          routeChangeComplete(routeUrl);
        }
      };
      const handleRouteChangeError = () => {
        if (routeChangeError) {
          routeChangeError();
        }
      };

      router.events.on('routeChangeStart', handleRouteChangeStart);
      router.events.on('routeChangeComplete', handleRouteChangeComplete);
      router.events.on('routeChangeError', handleRouteChangeError);

      return () => {
        if (unsubRouteChangeStart) {
          router.events.off('routeChangeStart', handleRouteChangeStart);
        }
        if (unsubRouteChangeComplete) {
          router.events.off('routeChangeComplete', handleRouteChangeComplete);
        }
        if (unsubRouteChangeError) {
          router.events.off('routeChangeError', handleRouteChangeError);
        }

        effRan.current = true;
      };
    }
  }, [
    routeChangeStart,
    routeChangeComplete,
    routeChangeError,
    router.events,
    unsubRouteChangeStart,
    unsubRouteChangeComplete,
    unsubRouteChangeError,
  ]);
}

useRouteChangeHandlers.defaultProps = {
  unsubRouteChangeStart: true,
  unsubRouteChangeComplete: true,
  unsubRouteChangeError: true,
} as Partial<Props>;

export default useRouteChangeHandlers;
