import React, { useEffect, useState } from 'react';
import {
  Modal,
  Form,
  Row,
  Col,
  Input,
  DatePicker,
  TimePicker,
  InputNumber,
  Button,
  Table,
  Popconfirm,
  Divider,
  message,
  Select
} from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { addShows, updateShow, deleteShow, getShowsByTheatre } from '../../api/shows';
import { getAllMovies } from '../../api/movies';
import dayjs from 'dayjs';

function ShowFormModal({
  isModalOpen,
  setIsModalOpen,
  selectedTheatre,
}) {
  const [form] = Form.useForm();
  const [shows, setShows] = useState([]);
  const [formType, setFormType] = useState('add');
  const [selectedShow, setSelectedShow] = useState(null);
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      const res = await getAllMovies();
      if (res.success) {
        setMovies(res.data);
      } else {
        message.error("Failed to load movies");
      }
    };

    fetchMovies();
  }, []);

  useEffect(() => {
    if (isModalOpen && selectedTheatre) {
      fetchShows();
      setFormType('add');
      setSelectedShow(null);
    }
  }, [isModalOpen, selectedTheatre]);

  const fetchShows = async () => {
    const response = await getShowsByTheatre(selectedTheatre._id);
    if (response.success) {
      setShows(response.data);
    } else {
      message.error(response.message);
    }
  };

  const onFinish = async (values) => {
    try {
      const payload = {
        showName: values.showName,
        movie: values.movie,
        ticketPrice: values.ticketPrice,
        totalSeats: values.totalSeats,
        showDate: values.showDate.format('YYYY-MM-DD'),
        showTime: values.showTime.format('HH:mm'),
        theatre: selectedTheatre._id,
      };

      let response;
      if (formType === 'edit') {
        response = await updateShow(selectedShow._id, payload);
      } else {
        response = await addShows(payload);
      }
      if (response.success) {
        message.success(response.message);
        fetchShows();
        setFormType('add');
        setSelectedShow(null);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error(error.message || 'Something went wrong');
    }
  };

  const handleEdit = (record) => {
    setFormType('edit');
    setSelectedShow(record);
    form.setFieldsValue({
      ...record,
      showDate: dayjs(record.showDate),
      showTime: dayjs(record.showTime, 'HH:mm'),
    });
  };

  const handleDelete = async (record) => {
    const response = await deleteShow(record._id);
    if (response.success) {
      message.success(response.message);
      fetchShows();
    } else {
      message.error(response.message);
    }
  };

  return (
    <Modal
      title={formType === 'edit' ? 'Edit Show' : 'Add Show'}
      open={isModalOpen}
      footer={null}
      onCancel={() => {
        setIsModalOpen(false);
        setFormType('add');
        setSelectedShow(null);
      }}
      width={850}
    >
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="showName"
              label="Show Name"
              rules={[{ required: true, message: 'Please enter the show name' }]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="movie"
              label="Movie Name"
              rules={[{ required: true, message: 'Please select a movie' }]}
            >
              <Select placeholder="Select a movie">
                {movies.map((movie) => (
                  <Select.Option key={movie._id} value={movie._id}>
                    {movie.title}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item
              name="ticketPrice"
              label="Ticket Price"
              rules={[{ required: true, message: 'Please enter the ticket price' }]}
            >
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item
              name="totalSeats"
              label="Total Seats"
              rules={[{ required: true, message: 'Please enter the total seats' }]}
            >
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item
              name="showDate"
              label="Show Date"
              rules={[{ required: true, message: 'Please select a show date' }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item
              name="showTime"
              label="Show Time"
              rules={[{ required: true, message: 'Please select a show time' }]}
            >
              <TimePicker format="HH:mm" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item>
          <Button type="primary" htmlType="submit" block size='large'>
            {formType === 'add' ? 'Add' : 'Update'}
          </Button>
        </Form.Item>
      </Form>

      <Divider>Current Shows</Divider>

      <Table
        columns={[
          { title: 'Show', dataIndex: 'showName' },
          {
            title: 'Movie',
            dataIndex: 'movie',
            render: (text, record) => {
              const movie = movies.find((m) => m._id === record.movie);
              return movie.title
            }
          },

          { title: 'Date', dataIndex: 'showDate' },
          { title: 'Time', dataIndex: 'showTime' },
          { title: 'Price', dataIndex: 'ticketPrice' },
          { title: 'Total Seats', dataIndex: 'totalSeats' },
          { title: 'Available Seats', dataIndex: 'availableSeats' },
          {
            title: 'Action',
            render: (text, record) => (
              <div >
                <Button>
                  <EditOutlined onClick={() => handleEdit(record)}
                  /></Button>
                <Button>
                  <Popconfirm
                    title="Are you sure you want to delete this show?"
                    okText="Yes"
                    cancelText="No"
                    onConfirm={() => handleDelete(record)}
                  >
                    <DeleteOutlined />
                  </Popconfirm>
                </Button>
              </div>
            ),
          },
        ]}
        dataSource={shows}
        pagination={false}
        size="small"
        scroll={{ x: 700 }}
      />
    </Modal>
  );
}

export default ShowFormModal;