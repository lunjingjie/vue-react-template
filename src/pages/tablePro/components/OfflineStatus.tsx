import React from 'react';
import { Badge } from 'antd';

const OfflineStatus: React.FC = () => {
  return <Badge status="error" text="离线" />;
};

export default React.memo(OfflineStatus);
