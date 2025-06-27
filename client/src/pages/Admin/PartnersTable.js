import React from 'react';
import { Table, Tag, Button } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

function PartnersTable({ partners, onApprove, onReject }) {
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      render: (role) => (
        <Tag color={role === 'partner' ? 'green' : 'blue'}>{role}</Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'partnerStatus',
      render: (text) => {
        let color = 'default';
        if (text === 'none') color = 'default';
        if (text === 'pending') color = 'orange';
        if (text === 'approved') color = 'green';
        return <Tag color={color}>
          {text || 'N/A'}
        </Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button
            type={record.partnerStatus === 'approved' ? 'default' : 'primary'}
            icon={<CheckCircleOutlined />}
            onClick={() => onApprove(record)}
          >
            Approve
          </Button>

          <Button
            type={record.partnerStatus === 'none' ? 'default' : 'primary'}
            danger
            icon={<CloseCircleOutlined />}
            onClick={() => onReject(record)}
          >
            Reject
          </Button>

        </div>
      )
    }
  ];

  return (
    <Table
      columns={columns}
      dataSource={partners}
      rowKey="_id"
      pagination={{ pageSize: 6 }}
    />
  );
}

export default PartnersTable;
