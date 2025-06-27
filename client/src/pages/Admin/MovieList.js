import { React, useEffect, useState } from 'react';
import { Table, Button } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { hideLoading, showLoading } from '../../redux/loaderSlice.js';
import { useDispatch } from 'react-redux';
import { getAllMovies } from '../../api/movies.js';
import MovieForm from './MovieForm.js';
import moment from 'moment';
import DeleteMovieModal from './DeleteMovieModal.js';

function MovieList() {
  const [movies, setMovies] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [formType, setFormType] = useState('add');
  const dispatch = useDispatch();

  const getData = async () => {
    try {
      dispatch(showLoading());
      const response = await getAllMovies();
      const allMovies = response.data.map((item) => ({
        ...item,
        key: `movie-${item._id}`,
      }))
      setMovies(allMovies);
    } catch (error) {
      console.error("Failed to fetch movies:", error);
      setMovies([]);
    } finally {
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const columns = [
    {
      title: "Poster",
      dataIndex: "poster",
      render: (text, data) => (
        <img src={data.poster} width="75" height="116" style={{ objectFit: "cover" }} alt="Poster" />
      )
    },
    { title: "Name", dataIndex: "title" },
    { title: "Rating", dataIndex: "rating" },
    { title: "Genre", dataIndex: "genre" },
    {
      title: "Release Date",
      dataIndex: "releaseDate",
      render: (text) => moment(text).format('DD-MM-YYYY'),
    },
    {
      title: "Duration",
      dataIndex: "duration",
      render: (text) => `${text} min`,
    },
    { title: "Language", dataIndex: "language" },
    {
      title: "Action",
      render: (_, record) => (
        <>
          <Button
            onClick={() => {
              setIsModalOpen(true);
              setSelectedMovie(record);
              setFormType('edit');
            }}
          >
            <EditOutlined />
          </Button>
          <Button
            danger
            onClick={() => {
              setDeleteModalOpen(true);
              setSelectedMovie(record);
              setFormType('delete');
            }}
          >
            <DeleteOutlined />
          </Button>
        </>
      )
    }
  ];

  return (
    <div>
      <div className="d-flex justify-content-end mb-2">
        <Button
          type="primary"
          onClick={() => {
            setIsModalOpen(true);
            setFormType('add');
          }}
        >
          Add Movie
        </Button>
      </div>

      <Table columns={columns} dataSource={movies} pagination={{ pageSize: 5 }} />
      
      {isModalOpen && (
        <MovieForm
          isModalOpen={isModalOpen} 
          setIsModalOpen={setIsModalOpen}
          selectedMovie={selectedMovie}
          setSelectedMovie={setSelectedMovie}
          formType={formType}
          getData={getData}
        />
      )}

      {deleteModalOpen && (
        <DeleteMovieModal
          isDeleteModalOpen={deleteModalOpen}
          setIsDeleteModalOpen={setDeleteModalOpen}
          selectedMovie={selectedMovie}
          setSelectedMovie={setSelectedMovie}
          getData={getData}
        />
      )}
    </div>
  );
}

export default MovieList;
