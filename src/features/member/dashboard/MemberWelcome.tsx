import React from 'react';
import { useMemberAuthContext } from '@utils/context/MemberAuthContext';

type Props = {
  activeOrders?: number;
  loading?: boolean;
};

function MemberWelcome({ activeOrders = 0, loading = false }: Props) {
  const { member } = useMemberAuthContext();

  // Resolve the time-based greeting after mount to avoid SSR/client mismatch.
  const [greeting, setGreeting] = React.useState('Halo');
  React.useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 11) setGreeting('Selamat pagi');
    else if (hour < 15) setGreeting('Selamat siang');
    else if (hour < 19) setGreeting('Selamat sore');
    else setGreeting('Selamat malam');
  }, []);

  let summaryText = 'Selamat datang kembali di dashboard Anda.';
  if (!loading) {
    summaryText =
      activeOrders > 0
        ? `Anda memiliki ${activeOrders} cucian yang sedang berjalan.`
        : 'Tidak ada cucian aktif saat ini.';
  }

  return (
    <div className="member-welcome card border-0 shadow-none mb-4">
      <div className="card-body bg-accent2 text-white rounded">
        <h3 className="fw-bolder text-white mb-1">
          {greeting}, {member?.username || 'Member'}!
        </h3>
        <p className="mb-0 opacity-75">{summaryText}</p>
      </div>
    </div>
  );
}

MemberWelcome.defaultProps = {
  activeOrders: 0,
  loading: false,
};

export default MemberWelcome;
