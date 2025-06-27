import React from 'react';
import { Table, Button, Tag } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

function TheatresTable({ theatres = [], onApprove, onReject }) {
  const columns = [
    {
      title: 'Theatre Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'City',
      dataIndex: 'city',
      key: 'city',
    },
    {
      title: 'Owner Email',
      key: 'ownerEmail',
      render: (_, record) => record?.owner?.email || 'N/A',
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive) => (
        <Tag color={isActive ? 'green' : 'orange'}>
          {isActive ? 'Approved' : 'Pending'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button
            type={record.isActive ? 'default' : 'primary'}
            icon={<CheckCircleOutlined />}
            onClick={() => onApprove(record)}
          >
            Approve
          </Button>
          <Button
            type={record.isActive ? 'primary' : 'default'}
            danger
            icon={<CloseCircleOutlined />}
            onClick={() => onReject(record)}
          >
            Reject
          </Button>
        </div>
      )
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={theatres.map((item) => ({
        ...item,
        key: item._id,
      }))}
      pagination={{ pageSize: 6 }}
    />
  );
}

export default TheatresTable;
