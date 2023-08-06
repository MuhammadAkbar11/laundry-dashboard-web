import { BOOTSTRAP_BREAKPOINTS } from '@configs/varsConfig';
import { useEffect, useState } from 'react';

type Variant = keyof typeof BOOTSTRAP_BREAKPOINTS;

function useMediaQuery(variant: Variant): boolean {
  const query = BOOTSTRAP_BREAKPOINTS[variant];

  const [matches, setMatches] = useState<boolean>(true);

  useEffect(() => {
    const getMatches = (value: string): boolean => {
      // Prevents SSR issues
      if (typeof window !== 'undefined') {
        return window.matchMedia(value).matches;
      }
      return false;
    };

    const handleChange = () => setMatches(getMatches(query));

    const matchMedia = window.matchMedia(query);

    // Triggered at the first client-side load and if query changes
    handleChange();

    // Listen matchMedia
    if (matchMedia.addEventListener) {
      matchMedia.addEventListener('change', handleChange);
    } else {
      matchMedia.addEventListener('change', handleChange);
    }

    return () => {
      if (matchMedia.removeEventListener) {
        matchMedia.removeEventListener('change', handleChange);
      } else {
        matchMedia.removeEventListener('change', handleChange);
      }
    };
  }, [query]);

  return matches;
}

export default useMediaQuery;
