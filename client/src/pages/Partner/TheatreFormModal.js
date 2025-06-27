import React, { useEffect } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { useSelector } from 'react-redux';
import { addTheatre, updateTheatre } from '../../api/theatres';

function TheatreFormModal({
  isModalOpen,
  setIsModalOpen,
  selectedTheatre,
  setSelectedTheatre,
  formType,
  getData,
}) {
  const [form] = Form.useForm();
  const { user } = useSelector((state) => state.users);

  useEffect(() => {
    if (formType === 'edit' && selectedTheatre) {
      form.setFieldsValue(selectedTheatre);
    } else {
      form.resetFields();
    }
  }, [formType, selectedTheatre, form]);

  const onFinish = async (values) => {
    try {
      let response;
      if (formType === 'add') {
        response = await addTheatre({ ...values, owner: user._id });
      } else {
        response = await updateTheatre({ ...values, theatreId: selectedTheatre._id });
      }

      if (response.success) {
        message.success(response.message);
        getData();
        setIsModalOpen(false);
        setSelectedTheatre(null);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error(error.message || 'Something went wrong');
    }
  };

  return (
    <Modal
      title={formType === 'add' ? 'Add Theatre' : 'Edit Theatre'}
      open={isModalOpen}
      footer={null} // removes default OK/Cancel
      onCancel={() => {
        setIsModalOpen(false);
        setSelectedTheatre(null);
      }}
    >
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Form.Item
          label="Theatre Name"
          name="name"
          rules={[{ required: true, message: 'Please enter the theatre name' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Address"
          name="address"
          rules={[{ required: true, message: 'Please enter the address' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="City"
          name="city"
          rules={[{ required: true, message: 'Please enter the city' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Phone"
          name="phone"
          rules={[{ required: true, message: 'Please enter the phone number' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Please enter the email' },
            { type: 'email', message: 'Please enter a valid email' },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            {formType === 'add' ? 'Add' : 'Update'}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default TheatreFormModal;
