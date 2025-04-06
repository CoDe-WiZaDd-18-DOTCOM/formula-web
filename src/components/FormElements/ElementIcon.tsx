
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ElementIconProps {
  icon: LucideIcon;
}

export const ElementIcon: React.FC<ElementIconProps> = ({ icon: Icon }) => {
  return <Icon className="h-5 w-5" />;
};
