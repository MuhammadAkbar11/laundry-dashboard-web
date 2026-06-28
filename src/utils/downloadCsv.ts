import { AxiosInstance } from 'axios';

function getFilenameFromDisposition(
  disposition?: string,
  fallback = 'export.csv'
) {
  if (!disposition) return fallback;

  const match = disposition.match(/filename="?([^";]+)"?/i);
  return match?.[1] || fallback;
}

async function downloadCsvFile(
  axiosInstance: AxiosInstance,
  url: string,
  fallbackFilename: string
) {
  const response = await axiosInstance.get(url, {
    responseType: 'blob',
  });

  const blob = new Blob([response.data], {
    type: 'text/csv;charset=utf-8;',
  });

  const filename = getFilenameFromDisposition(
    response.headers['content-disposition'],
    fallbackFilename
  );

  const downloadUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(downloadUrl);
}

export default downloadCsvFile;
