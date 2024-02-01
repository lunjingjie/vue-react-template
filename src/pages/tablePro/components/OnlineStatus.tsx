import React from 'react';
import { Badge } from 'antd';

const OnlineStatus: React.FC = () => {
  return <Badge status="processing" text="运行中" />;
};

export default React.memo(OnlineStatus);
