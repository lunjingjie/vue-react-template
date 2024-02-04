import { createHashRouter } from 'react-router-dom';
import TablePro from '../../pages/tablePro/TablePro';
import DashBoard from '../../pages/dashboard/DashBoard';

export const routerList = [
	{
		path: '/basic1',
		element: <DashBoard />,
    name: '平台概览',
	},
  {
		path: '/basic2',
		element: <TablePro />,
    name: '网关列表',
	},
];

export const router = createHashRouter(routerList);