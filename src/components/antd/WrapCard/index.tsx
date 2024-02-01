import { Card } from 'antd';
import React from 'react';
import type { ReactNode } from 'react';
import './index.scss';

interface CardType {
  children?: ReactNode,
}

export const WrapCard: React.FC<CardType> = ({ children }) => {
  return (
    <Card className='card-base'>
      {children}
    </Card>
  );
};
