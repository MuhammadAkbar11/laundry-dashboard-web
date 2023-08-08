import React from 'react';
import { Alert } from 'react-bootstrap';

function ProfileInvalidWarning() {
  return (
    <Alert variant="warning">
      <Alert.Heading>Peringatan</Alert.Heading>
      <p>
        Profil Anda tidak valid. Mohon periksa kembali informasi yang Anda
        masukkan.
      </p>
      <hr />
      <p className="mb-0">
        Untuk dapat melakukan pemesanan, Anda disarankan untuk memperbarui dan
        melengkapi profil dengan informasi yang benar.
      </p>
    </Alert>
  );
}

export default ProfileInvalidWarning;
