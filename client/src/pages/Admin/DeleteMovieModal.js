import { Modal, message } from "antd";
import { deleteMovie } from "../../api/movies";
import { showLoading, hideLoading } from "../../redux/loaderSlice";
import { useDispatch } from "react-redux";

function DeleteMovieModal(props){
  const isDeleteModalOpen = props.isDeleteModalOpen;
  const setIsDeleteModalOpen = props.setIsDeleteModalOpen;
  const selectedMovie = props.selectedMovie
  const setSelectedMovie = props.setSelectedMovie
  const getData = props.getData;
  const dispatch = useDispatch();

  const handleOk = async () => {
    try {
      dispatch(showLoading());
      const movieId = selectedMovie._id;
      const response = await deleteMovie({ movieId });
      if (response.success) {
        message.success(response.message);
        getData();
      } else {
        message.error(response.message);
      }
      setIsDeleteModalOpen(false);
      setSelectedMovie(null);
      dispatch(hideLoading());
    } catch (err) {
      dispatch(hideLoading());
      setIsDeleteModalOpen(false);
      message.error(err.message || "Something went wrong");
    }
  };

  const handleCancel = () => {
    setIsDeleteModalOpen(false);
    setSelectedMovie(null);
  };

  return (
    <Modal
      title="Delete Movie"
      open={isDeleteModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <p>Are you sure you want to delete <strong>{selectedMovie?.title}</strong>?</p>
    </Modal>
  );
};

export default DeleteMovieModal;
