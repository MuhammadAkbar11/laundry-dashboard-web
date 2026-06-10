import React from 'react';
import * as Lucide from 'lucide-react';
import { LucideIconTypes } from '@utils/types';

type Props = {
  name: LucideIconTypes;
  size?: number;
} & Lucide.LucideProps;

function AppIcon({ name, ...props }: Props) {
  const Icon = Lucide[
    `${name}` as LucideIconTypes
  ] as React.ElementType<Lucide.LucideProps>;

  if (!Icon) return null;

  return <Icon {...props} />;
}

AppIcon.defaultProps = {
  size: 18,
};

export default AppIcon;
