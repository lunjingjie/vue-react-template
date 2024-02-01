import React, { useMemo } from 'react';
import './icon.scss';
import { InlineIcon } from '@iconify/react';
import { SYSTEM } from '../../../constants';

interface IconType {
  icon: string;
  color?: string;
  size?: number;
  spin?: boolean;
  [key: string]: any;
}

export const Icon: React.FC<IconType> = (props: IconType) => {
  const { icon, color, size = 24, spin, class: pClass } = props;

  // useEffect(() => {
  //   const update = () => {
  //     const el = element.current;
  //     if (!el) return;
  //     const span = document.createElement('span');
  //     span.className = 'iconify';
  //     span.dataset.icon = icon;
  //     el.textContent = '';
  //     el.appendChild(span);
  //   }
  //   update();
  // }, [icon]);

  const getWrapStyle = useMemo(
    () => ({
      fontSize: `${size}px`,
      color: color || SYSTEM.primaryColor,
      display: 'inline-flex',
    }),
    [size, color],
  );

  return (
    <InlineIcon
      icon={icon}
      style={getWrapStyle}
      className={`${pClass} app-iconify anticon ${spin && 'app-iconify-spin'}`}
    ></InlineIcon>
  );
};
