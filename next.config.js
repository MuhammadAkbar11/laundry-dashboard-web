/* eslint-disable */
/** @type {import('next').NextConfig} */
const path = require('path');

const imagesDomains = process.env.UPLOAD_DOMAINS?.split(',') ?? [''];

const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  images: {
    domains: [...imagesDomains],
  },
  async redirects() {
    return [
      {
        source: '/pemesanan-berhasil',
        destination: '/m/pemesanan/berhasil',
        permanent: false,
      },
      {
        source: '/pemesanan',
        destination: '/m/pemesanan',
        permanent: false,
      },
      {
        source: '/pembayaran/sukses',
        destination: '/m/pembayaran/sukses',
        permanent: false,
      },
      {
        source: '/pembayaran/:laundryQueueId',
        destination: '/m/pembayaran/:laundryQueueId',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
