import React from 'react';
import { Modal, Button, message } from 'antd';
import { deleteTheatre } from '../../api/theatres';

function DeleteTheatreModal({
  deleteModalOpen,
  setDeleteModalOpen,
  selectedTheatre,
  setSelectedTheatre,
  getData,
}) {
  const handleDelete = async () => {
    try {
      const response = await deleteTheatre({ theatreId: selectedTheatre._id });

      if (response.success) {
        message.success(response.message);
        getData();
        setDeleteModalOpen(false);
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
      title="Delete Theatre"
      open={deleteModalOpen}
      onCancel={() => {
        setDeleteModalOpen(false);
        setSelectedTheatre(null);
      }}
      footer={null}
      destroyOnClose
    >
      <p>Are you sure you want to delete <strong>{selectedTheatre?.name}</strong>?</p>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
        <Button onClick={() => {
          setDeleteModalOpen(false);
          setSelectedTheatre(null);
        }}>
          Cancel
        </Button>
        <Button type="primary" danger onClick={handleDelete}>
          Delete
        </Button>
      </div>
    </Modal>
  );
}

export default DeleteTheatreModal;
