/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { IMemberAuth } from '@interfaces';
import { getMemberSessionService } from '@services/authMemberService';
import { useQuery } from '@tanstack/react-query';
import { useMemberAuthContext } from '@utils/context/MemberAuthContext';

interface IMemberAuthData {
  authState: IMemberAuth | null | undefined;
  isLoading: boolean;
  isAuth: boolean;
  refetchAuth: () => void;
}

function useMemberAuth(): IMemberAuthData {
  const { member: initAuthData } = useMemberAuthContext();

  const queryAuth = useQuery<{}, {}, IMemberAuth>(
    ['memberAuth'],
    getMemberSessionService,
    {
      staleTime: 5 * 1000,
      retry: (failureCount, error) => !error,
      onError: (err: any) => (err?.name === 'NOT_AUTH' ? null : err),
      initialData: initAuthData || undefined,
      useErrorBoundary: false,
    }
  );

  const { isLoading, data: authData, refetch: refetchAuth } = queryAuth;

  const isAuth = !!authData;
  const authState = authData;

  return {
    isLoading,
    isAuth,
    authState,
    refetchAuth,
  };
}

export default useMemberAuth;
