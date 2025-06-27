import React from 'react';
import { Modal, Button, message } from 'antd';
import { deleteShow } from '../../api/shows';

function DeleteShowModal({
  deleteModalOpen,
  setDeleteModalOpen,
  selectedShow,
  setSelectedShow,
  fetchShows,
}) {
  const handleDelete = async () => {
    try {
      const response = await deleteShow(selectedShow._id);

      if (response.success) {
        message.success(response.message);
        fetchShows(); // refresh list after deletion
        setDeleteModalOpen(false);
        setSelectedShow(null);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error(error.message || 'Something went wrong');
    }
  };

  return (
    <Modal
      title="Delete Show"
      open={deleteModalOpen}
      onCancel={() => {
        setDeleteModalOpen(false);
        setSelectedShow(null);
      }}
      footer={null}
    >
      <p>
        Are you sure you want to delete the show <strong>{selectedShow?.showName}</strong>?
      </p>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
        <Button onClick={() => {
          setDeleteModalOpen(false);
          setSelectedShow(null);
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

export default DeleteShowModal;
