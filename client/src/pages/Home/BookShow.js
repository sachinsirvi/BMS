import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { message, Card, Row, Col, Button } from 'antd';
import moment from 'moment';
import { showLoading, hideLoading } from '../../redux/loaderSlice';
import { getShowById } from '../../api/shows';
import { bookShow, makePayment } from '../../api/booking';

import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from '../../stripe/stripe';
import StripeCheckoutForm from '../../components/payments/StripeCheckoutForm';

const BookShow = () => {
  const { user } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();

  const [show, setShow] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [clientSecret, setClientSecret] = useState('');
  const [paymentReady, setPaymentReady] = useState(false);

  useEffect(() => {
    const fetchShow = async () => {
      try {
        dispatch(showLoading());
        const res = await getShowById(params.id);
        if (res.success) {
          setShow({
            ...res.data,
            bookedSeats: Array.isArray(res.data.bookedSeats) ? res.data.bookedSeats : [],
          });
        } else {
          message.error(res.message);
        }
      } catch (err) {
        message.error(err.message);
      } finally {
        dispatch(hideLoading());
      }
    };
    fetchShow();
  }, [params.id, dispatch]);

  useEffect(() => {
    if (selectedSeats.length === 0) {
      setClientSecret('');
      setPaymentReady(false);
    }
  }, [selectedSeats]);

  const isSeatBooked = (num) => show?.bookedSeats?.includes(num);

  const handlePayment = async () => {
    try {
      const amount = show.ticketPrice * selectedSeats.length * 100;
      const res = await makePayment({ amount });
      if (res.success) {
        setClientSecret(res.data.clientSecret);
        setPaymentReady(true);
      } else {
        message.error("Payment initialization failed.");
      }
    } catch (err) {
      message.error(err.message);
    } 
  };

  const handleBookingSuccess = async (transactionId) => {
    try {
      dispatch(showLoading());
      const res = await bookShow({
        transactionId,
        show: params.id,
        seats: selectedSeats,
        user: user._id,
      });
      if (res.success) {
        message.success("Booking confirmed!");
        setSelectedSeats([]);
        navigate("/profile");
      } else {
        message.error(res.message);
      }
    } catch (err) {
      message.error(err.message);
    } finally {
      dispatch(hideLoading());
    }
  };

  const renderSeats = () => {
    const totalSeats = show.totalSeats;
    return (
      <div className="d-flex flex-column align-items-center">
        <p className="text-center mb-10px">Screen this side, you will be watching in this direction</p>
        <div className="screen-div" ></div>

        <ul className="seat-ul justify-content-center" >
          {Array.from({ length: totalSeats }).map((_, index) => {
            const seatNumber = index + 1;
            const isBooked = isSeatBooked(seatNumber);
            const isSelected = selectedSeats.includes(seatNumber);
            const baseStyle = {
              width: 40, height: 30, margin: 1, border: '1px solid #ccc',
              cursor: isBooked ? 'not-allowed' : 'pointer',
              backgroundColor: isBooked ? '#ccc' : isSelected ? '#4FE34F' : '#fff',
              color: isBooked ? '#555' : '#000',
            };

            return (
              <li key={seatNumber}>
                <button
                  style={baseStyle}
                  disabled={isBooked}
                  onClick={() => {
                    if (isBooked) return;
                    if (isSelected) {
                      setSelectedSeats(selectedSeats.filter((s) => s !== seatNumber));
                    } else {
                      setSelectedSeats([...selectedSeats, seatNumber]);
                    }
                  }}
                >
                  {seatNumber}
                </button>
              </li>
            );
          })}
        </ul>

        <div className="d-flex justify-content-between w-100 max-width-600 mx-auto mt-3">
          <div><strong>SEATS :  {selectedSeats.join(', ') || 'None'} </strong></div>
          <div style={{marginBottom: '20px'}}><strong>TOTAL :  ${ (selectedSeats.length * show.ticketPrice).toFixed(2) } </strong></div>
        </div>
      </div>
    );
  };

  return (
    show && (
      <Row gutter={24}>
        <Col span={24}>
          <Card>
            <Row justify="space-between" align="middle" gutter={[16, 16]}>
              <Col xs={24} md={16}>
                <h1 style={{ margin: 0 }}>{show.movie.title}</h1>
                <p><strong>Theatre:</strong> {show.theatre.name}</p>
                <p><strong>Address:</strong> {show.theatre.address}</p>
              </Col>
              <Col xs={24} md={8} style={{ textAlign: 'left' }}>
                <h3 style={{ margin: 0 }}>
                  {moment(show.showDate).format('MMM Do')} <br />
                  {moment(show.showTime, 'HH:mm').format('hh:mm A')}
                </h3>
              </Col>
            </Row>

            <hr style={{ margin: '1rem 0' }} />

            {renderSeats()}

            {selectedSeats.length > 0 && (
              <div>
                <Button type="primary" block size="large" onClick={handlePayment}>
                  Start Payment
                </Button>
              </div>
            )}

            {paymentReady && clientSecret && (
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <StripeCheckoutForm onBookingSuccess={handleBookingSuccess} />
              </Elements>
            )}
          </Card>
        </Col>
      </Row>
    )
  );
};

export default BookShow;
