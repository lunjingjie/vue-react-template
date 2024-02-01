import { createHashRouter } from 'react-router-dom';
import BasicManage from '../../pages/basicManage/BasicManage';
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
  {
		path: '/basic3',
		element: <BasicManage />,
    name: '报错信息',
	},
  {
		path: '/basic4',
		element: <BasicManage />,
    name: '数据质量',
	},
];

export const router = createHashRouter(routerList);