import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import TheatreFormModal from './TheatreFormModal';
import DeleteTheatreModal from './DeleteTheatreModal';
import { Table, Button, message } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { allPartnerTheatres } from '../../api/theatres.js';
import { hideLoading, showLoading } from '../../redux/loaderSlice.js';
import ShowFormModal from '../Partner/ShowFormModal.js';


function TheatreList() {
  const { user } = useSelector((state) => state.users);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showModalOpen, setShowModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [theatres, setTheatres] = useState([]);
  const [selectedTheatre, setSelectedTheatre] = useState(null);
  const [formType, setFormType] = useState('add');
  const dispatch = useDispatch();
 
  const getData = async () => {
    try {
      dispatch(showLoading());
      const response = await allPartnerTheatres(user._id);
      if (response.success) {
        setTheatres(
          response.data.map((item) => ({
            ...item,
            key: `theatre-${item._id}`,
          }))
        );
      } else {
        message.error(response.message);
      }
      dispatch(hideLoading());
    } catch (error) {
      dispatch(hideLoading());
      message.error(error.message);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Phone Number",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive) => (isActive ? 'Approved' : 'Pending')
    },
    {
      title: "Action",
      key: "action",
      render: (text, data) => (
        <div className="d-flex align-items-center gap-10">
          <Button
            onClick={() => {
              setIsModalOpen(true);
              setFormType("edit");
              setSelectedTheatre(data);
            }}
          >
            <EditOutlined />
          </Button>

          <Button
            onClick={() => {
              setDeleteModalOpen(true);
              setSelectedTheatre(data);
            }}
          >
            <DeleteOutlined />
          </Button>

          {data.isActive && (
            <Button type='primary'
              onClick={() => {
                setSelectedTheatre(data);
                setShowModalOpen(true);
              }}
            >
              +Shows
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="d-flex justify-content-end">
        <Button
          type="primary"
          onClick={() => {
            setIsModalOpen(true);
            setFormType("add");
            setSelectedTheatre(null);
          }}
        >
          Add Theatre
        </Button>
      </div>

      <Table dataSource={theatres} columns={columns} />

      {isModalOpen && (
        <TheatreFormModal
          isModalOpen={isModalOpen}
          selectedTheatre={selectedTheatre}
          setSelectedTheatre={setSelectedTheatre}
          setIsModalOpen={setIsModalOpen}
          formType={formType}
          getData={getData} // refresh list after save
        />
      )}

      {deleteModalOpen && (
        <DeleteTheatreModal
          deleteModalOpen={deleteModalOpen}
          setDeleteModalOpen={setDeleteModalOpen}
          selectedTheatre={selectedTheatre}
          setSelectedTheatre={setSelectedTheatre}
          getData={getData} // refresh list after deletion
        />
      )}

      {showModalOpen && (
        <ShowFormModal
          isModalOpen={showModalOpen}
          setIsModalOpen={setShowModalOpen}
          selectedTheatre={selectedTheatre}
        />
      )}
    </>
  );
}

export default TheatreList;
