import React from 'react';
import Link from 'next/link';
import { Badge, Card, Placeholder, Table } from 'react-bootstrap';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import EmptyState from '@components/Web/EmptyState/EmptyState';

type RecentMember = {
  memberId: string;
  username: string;
  email: string;
  status: string;
  createdAt: string;
};

type Props = {
  members?: RecentMember[];
  loading?: boolean;
};

function AdminRecentMembers({ members = [], loading = false }: Props) {
  let content: React.ReactNode;
  if (loading) {
    content = (
      <Placeholder as="div" animation="glow" className="p-3">
        {[0, 1, 2, 3, 4].map((row) => (
          <Placeholder key={row} xs={12} className="mb-2" size="lg" />
        ))}
      </Placeholder>
    );
  } else if (members.length === 0) {
    content = (
      <EmptyState
        title="Belum ada anggota"
        description="Anggota baru akan muncul di sini."
        icon={faUsers}
      />
    );
  } else {
    content = (
      <Table hover responsive size="sm" className="align-middle mb-0">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Status</th>
            <th>Tanggal Daftar</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member.memberId}>
              <td className="text-nowrap fw-semibold">{member.username}</td>
              <td>{member.email}</td>
              <td>
                <Badge bg={member.status === 'ACTIVE' ? 'success' : 'warning'}>
                  {member.status}
                </Badge>
              </td>
              <td className="text-nowrap">
                {new Date(member.createdAt).toLocaleDateString('id-ID')}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  }

  return (
    <Card className="h-100">
      <Card.Header className="bg-light d-flex align-items-center justify-content-between">
        <Card.Title className="mb-0">Anggota Terbaru</Card.Title>
        <Link
          href="/admin/laundry/member"
          className="small fw-semibold text-decoration-none"
        >
          Lihat semua
        </Link>
      </Card.Header>
      <Card.Body>{content}</Card.Body>
    </Card>
  );
}

AdminRecentMembers.defaultProps = {
  members: [],
  loading: false,
};

export default AdminRecentMembers;
