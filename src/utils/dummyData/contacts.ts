import { LucideIconTypes } from '@utils/types';

export type ContactInfoItem = {
  id: string;
  icon: LucideIconTypes;
  label: string;
  value: string;
  href?: string;
  external?: boolean;
};

export const contactInfo: ContactInfoItem[] = [
  {
    id: 'address',
    icon: 'MapPin',
    label: 'Alamat',
    value: 'Jatimakmur, Bekasi, Indonesia',
  },
  {
    id: 'phone',
    icon: 'Phone',
    label: 'Telepon',
    value: '+62 852-3456-6789',
    href: 'tel:+6285234566789',
  },
  {
    id: 'whatsapp',
    icon: 'MessageCircle',
    label: 'WhatsApp',
    value: '+62 852-3456-6789',
    href: 'https://wa.me/6285234566789',
    external: true,
  },
  {
    id: 'email',
    icon: 'Mail',
    label: 'Email',
    value: 'customercuciin@gmail.com',
    href: 'mailto:customercuciin@gmail.com',
  },
];

export type ContactAction = {
  id: string;
  icon: LucideIconTypes;
  label: string;
  href: string;
  external?: boolean;
  variant: 'accent1' | 'outline-accent1';
};

export const contactActions: ContactAction[] = [
  {
    id: 'whatsapp',
    icon: 'MessageCircle',
    label: 'Chat WhatsApp',
    href: 'https://wa.me/6285234566789',
    external: true,
    variant: 'accent1',
  },
  {
    id: 'call',
    icon: 'Phone',
    label: 'Telepon',
    href: 'tel:+6285234566789',
    variant: 'outline-accent1',
  },
  {
    id: 'email',
    icon: 'Mail',
    label: 'Kirim Email',
    href: 'mailto:customercuciin@gmail.com',
    variant: 'outline-accent1',
  },
  {
    id: 'directions',
    icon: 'Navigation',
    label: 'Petunjuk Arah',
    href: 'https://www.google.com/maps/dir/?api=1&destination=PondokGede+Bekasi+Indonesia',
    external: true,
    variant: 'outline-accent1',
  },
];

export const mapEmbedUrl =
  'https://www.google.com/maps?q=PondokGede+Bekasi+Indonesia&output=embed';
