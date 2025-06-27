import React, { useEffect, useState } from 'react';
import { Input, message, Row } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { showLoading, hideLoading } from '../../redux/loaderSlice';
import { getAllMovies } from '../../api/movies';

function Home() {
  const [movies, setMovies] = useState([]);
  const [searchText, setSearchText] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getData = async () => {
    try {
      dispatch(showLoading());
      const response = await getAllMovies();
      dispatch(hideLoading());
      if (response.success) {
        setMovies(response.data);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      message.error(error.message);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  return (
    <div style={{ padding: '40px 20px' }}>
      {/* Search Bar */}
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <Input
          placeholder="Type here to search for movies"
          prefix={<SearchOutlined />}
          onChange={handleSearch}
          style={{ width: '100%', maxWidth: '500px' }}
        />
      </div>

      <h1 className='d-flex justify-content-center align-items-center text-center' style={{marginBottom: 40}}>Book Your Favourite Shows 🍿</h1>

      {/* Movie Posters */}
      <Row
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          gap: '20px',
        }}
      >
        {movies
          .filter((movie) =>
            movie.title.toLowerCase().includes(searchText.toLowerCase())
          )
          .map((movie) => (
            <div
              key={movie._id}
              style={{
                width: '18%', // 5 per row (100% / 5 = 20%, minus gap)
                minWidth: '150px',
                cursor: 'pointer',
                textAlign: 'center',
                flexGrow: 1,
              }}
              onClick={() => navigate(`/movie/${movie._id}?date=${moment().format("YYYY-MM-DD")}`)}
            >
              <div
                style={{
                  width: '160px',
                  aspectRatio: '2/3',
                  overflow: 'hidden',
                  borderRadius: '10px',
                  marginBottom: '10px',
                  backgroundColor: '#f0f0f0',
                  margin: '0 auto',
                }}
              >
                <img
                  src={movie.poster}
                  alt={movie.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover', // fill nicely while staying proportional
                    borderRadius: '10px',
                  }}
                />
              </div>

              <h4 style={{ 'margin-top': '10px' }}>{movie.title}</h4>
            </div>
          ))}
      </Row>
    </div>
  );
}

export default Home;
