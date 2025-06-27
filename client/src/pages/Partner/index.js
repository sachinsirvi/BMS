import React from 'react';
import { useSelector } from 'react-redux';
import { Tabs, Result } from 'antd';
import TheatreList from './TheatreList';

function Partner() {
  const { user } = useSelector((state) => state.users);

  if (user?.partnerStatus !== 'approved') {
    return (
      <div style={{ marginTop: '250px' }}>
        <Result
          status="info"
          title="Approval Pending"
          subTitle="Your request to become a partner is still pending admin approval. Please check back later."
        />
      </div>
    );
  }

  const items = [
    {
      key: '1',
      label: 'Theatres',
      children: <TheatreList />,
    },
  ];

  return (
    <>
      <h1>Partner Dashboard</h1>
      <Tabs items={items} /> 
    </>
  );
}

export default Partner;