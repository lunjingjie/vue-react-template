import React, { useEffect, useState } from 'react';
import { ListParams } from '../../types/list/list';
import { Button, Input, Space, Table, Tooltip, Card } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { DataType } from './dataType';
import { getBasinListApi } from '../../api/basin/basin';
import { useSelector, useDispatch } from 'react-redux';
import { decrement, increment, increamentByAmount } from './counterSlice';
import { ModelWrap, WrapCard } from '../../components/antd';
import { Icon } from '../../components/common';

const BasicManage: React.FC = () => {
  const count = useSelector((state: any) => state.counter.value);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const [fieldValue, setFieldValue] = useState<ListParams>({
    current: 1,
    pageSize: 5,
    basinName: '',
  });

  const getBasinList = async (param: any) => {
    // const { data } = await getBasinListApi(param);
    // console.log(data);
    // setDataSource(data.data.records);
  };

  useEffect(() => {
    getBasinList(fieldValue);
  }, [fieldValue]);

  const resolveNull = (value: string | number) => {
    if (value === null) {
      return '--';
    }
    return value;
  };

  const columns: ColumnsType<DataType> = [
    {
      title: '流域名称',
      dataIndex: 'basinName',
      key: 'basinName',
      align: 'center',
    },
    {
      title: '备注',
      dataIndex: 'remarks',
      key: 'remarks',
      align: 'center',
      render: (_, record) => <span>{resolveNull(record.remarks)}</span>,
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      width: 200,
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => setOpen(true)}>
            编辑
          </Button>
          <Button type="link">删除</Button>
        </Space>
      ),
    },
  ];

  const [dataSource, setDataSource] = useState<DataType[]>([]);

  const ModelContent = () => <div>测试Modal内容</div>;

  return (
    <>
      <WrapCard>
        <span>{count}</span>
        <Button type='primary' onClick={() => dispatch(increment())}>+</Button>
        <Button type='primary' onClick={() => dispatch(decrement())}>-</Button>
        <Button type='primary' onClick={() => dispatch(increamentByAmount(3))}>any</Button>
        <Icon icon="material-symbols:5g-rounded"></Icon>
      </WrapCard>
      <WrapCard>
        <Space>
          <span>流域名称</span>
          <Input
            placeholder="流域名称："
            style={{ width: 200 }}
            onChange={(e) =>
              setFieldValue((fieldValue) => {
                fieldValue.basinName = e.target.value;
                return fieldValue;
              })
            }
          />
          <Tooltip title="查询">
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={() => getBasinList(fieldValue)}
            />
          </Tooltip>
          <Tooltip title="新增">
            <Button type="primary" icon={<PlusOutlined />} />
          </Tooltip>
        </Space>
      </WrapCard>
      <WrapCard>
        <Table size="small" bordered columns={columns} dataSource={dataSource} rowKey="basinId" />
      </WrapCard>
      <ModelWrap
        open={open}
        okFunc={() => setOpen(false)}
        cancelFunc={() => setOpen(false)}
        contentComp={ModelContent}
      ></ModelWrap>
    </>
  );
};

export default React.memo(BasicManage);
