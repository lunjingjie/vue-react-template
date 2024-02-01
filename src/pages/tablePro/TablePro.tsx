import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button } from 'antd';
import { useRef } from 'react';
import { getDeviceListApi } from '../../api/device';
import OfflineStatus from './components/OfflineStatus';
import OnlineStatus from './components/OnlineStatus';

export const waitTimePromise = async (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

export const waitTime = async (time: number = 100) => {
  await waitTimePromise(time);
};

type TableColumnItem = {
  DeviceId: string;
  CompanyName: string;
  SendTime: number;
};

const columns: ProColumns<TableColumnItem>[] = [
  // {
  //   dataIndex: 'index',
  //   key: 'index',
  //   valueType: 'indexBorder',
  //   width: 48,
  // },
  {
    title: '设备mn',
    dataIndex: 'DeviceId',
    key: 'DeviceId',
  },
  {
    title: '设备mn名称',
    key: 'CompanyName',
    dataIndex: 'CompanyName',
  },
  {
    hideInSearch: true,
    title: '在线状态',
    dataIndex: 'SendTime',
    key: 'SendTime',
    align: 'left',
    render: (text, record, _, action) => {
      return text === -1 ? <OfflineStatus /> : <OnlineStatus />;
    },
  },
  {
    hideInSearch: true,
    title: '最新数据时间',
    dataIndex: 'SendTime',
    sorter: true,
    key: 'SendTime',
    align: 'center',
    render: (text, record, _, action) => {
      return text === -1 ? (
        '--'
      ) : `${text}秒前`;
    },
  },
  {
    title: '操作',
    valueType: 'option',
    key: 'option',
    align: 'center',
    render: (text, record, _, action) => [
      <Button
        key={`edit${record.DeviceId}`}
        onClick={() => {
          action?.startEditable?.(record.DeviceId);
        }}
      >
        编辑
      </Button>,
      <Button key={`del${record.DeviceId}`}>删除</Button>,
    ],
  },
];

const TablePro = () => {
  const actionRef = useRef<ActionType>();
  return (
    <ProTable<TableColumnItem>
      style={{ margin: 10 }}
      columns={columns}
      actionRef={actionRef}
      cardBordered
      request={async (params, sort, filter) => {
        const { data } = await getDeviceListApi();
        return {
          data: data.data,
          // success 请返回 true，
          // 不然 table 会停止解析数据，即使有数据
          success: data.code === 1000,
          // 不传会使用 data 的长度，如果是分页一定要传
          total: data.data.length,
        };
      }}
      editable={{
        type: 'multiple',
      }}
      columnsState={{
        persistenceKey: 'pro-table-singe-demos',
        persistenceType: 'localStorage',
        onChange(value) {
          console.log('value: ', value);
        },
      }}
      rowKey="DeviceId"
      search={{
        labelWidth: 'auto',
      }}
      options={{
        setting: {
          listsHeight: 400,
        },
      }}
      form={{
        // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
        syncToUrl: (values, type) => {
          if (type === 'get') {
            return {
              ...values,
              created_at: [values.startTime, values.endTime],
            };
          }
          return values;
        },
      }}
      pagination={{
        pageSize: 10,
      }}
      dateFormatter="string"
      headerTitle="网关列表"
      toolBarRender={() => [
        <Button
          key="button"
          icon={<PlusOutlined />}
          onClick={() => {
            actionRef.current?.reload();
          }}
          type="primary"
        >
          新建
        </Button>,
      ]}
    />
  );
};

export default TablePro;
