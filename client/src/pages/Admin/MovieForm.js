import React from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Button,
  message,
  Row,
  Col
} from "antd";
import moment from "moment";
import { useDispatch } from "react-redux";
import { addMovie, updateMovie } from "../../api/movies";
import { showLoading, hideLoading } from "../../redux/loaderSlice";

function MovieForm(props) {
  const isModalOpen = props.isModalOpen;
  const setIsModalOpen = props.setIsModalOpen;
  const selectedMovie = props.selectedMovie;
  const setSelectedMovie = props.setSelectedMovie;
  const formType = props.formType;
  const getData = props.getData;
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
  };

  const onFinish = async (values) => {
    try {
      dispatch(showLoading());
      let response;
      if (formType === "edit") {
        if (!selectedMovie?._id) throw new Error("No movie selected");
        response = await updateMovie({ ...values, movieId: selectedMovie._id });
      } else {
        response = await addMovie(values);
      }
      if (response.success) {
        message.success(response.message);
        handleCancel();
        getData();
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error(error.message || "Failed to process movie");
    } finally {
      dispatch(hideLoading());
    }
  };

  return (
    <Modal
      title={formType === "add" ? "Add Movie" : "Edit Movie"}
      open={isModalOpen}
      onCancel={handleCancel}
      footer={null}
    >
      <Form
        layout="vertical"
        form={form}
        onFinish={onFinish}
        initialValues={
          formType === "edit" && selectedMovie
            ? {
              ...selectedMovie,
              releaseDate: moment(selectedMovie.releaseDate).format("YYYY-MM-DD"),
            }
            : {}
        }
      >
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              label="Movie Name"
              name="title"
              rules={[{ required: true, message: "Movie name is required" }]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label="Description"
              name="description"
              rules={[{ required: true, message: "Description is required" }]}
            >
              <Input.TextArea rows={4} />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              label="Duration (mins)"
              name="duration"
              rules={[{ required: true, message: "Duration is required" }]}
            >
              <Input type="number" />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              label="Rating"
              name="rating"
              rules={[{ required: true, message: "Rating is required" }]}
            >
              <Input type="number" min={0} max={5} />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              label="Language"
              name="language"
              rules={[{ required: true, message: "Language is required" }]}
            >
              <Select
                options={[
                  { value: "English", label: "English" },
                  { value: "Hindi", label: "Hindi" },
                  { value: "Punjabi", label: "Punjabi" },
                  { value: "Telugu", label: "Telugu" },
                  { value: "Bengali", label: "Bengali" },
                  { value: "German", label: "German" },
                ]}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Release Date"
              name="releaseDate"
              rules={[{ required: true, message: "Release date is required" }]}
            >
              <Input type="date" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Genre"
              name="genre"
              rules={[{ required: true, message: "Genre is required" }]}
            >
              <Select
                options={[
                  { value: "Action", label: "Action" },
                  { value: "Comedy", label: "Comedy" },
                  { value: "Horror", label: "Horror" },
                  { value: "Love", label: "Love" },
                  { value: "Patriot", label: "Patriot" },
                  { value: "Bhakti", label: "Bhakti" },
                  { value: "Thriller", label: "Thriller" },
                  { value: "Mystery", label: "Mystery" },
                ]}
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label="Poster URL"
              name="poster"
              rules={[{ required: true, message: "Poster URL is required" }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
          >
            {formType === "add" ? "Add Movie" : "Update Movie"}
          </Button>
          <Button
            block
            onClick={handleCancel}
            style={{ marginTop: 10 }}
          >
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default MovieForm;
