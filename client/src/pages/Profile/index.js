import { getAllBookings } from '../../api/booking';
import { Button, Card, Col, Row } from 'antd';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { useDispatch } from 'react-redux';

function Bookings() {
    const [bookings, setBookings] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        const getBookingData = async () => {
            try {
                const response = await getAllBookings();
                if (response.success) {
                    setBookings(response.data);
                } else {
                    console.error(response.message);
                }
            } catch (error) {
                console.error(error.message);
            }
        };
        getBookingData();
    }, []);

    return (
        <div>
            {bookings.length > 0 ? (
                <Row gutter={[16, 16]}>
                    {bookings.map((booking) => (
                        <Col span={24} key={booking._id}>
                            <Card style={{ borderRadius: 12, padding: 16 }}>
                                <Row align="middle" gutter={[16, 16]}>
                                    {/* Poster */}
                                    <Col xs={24} sm={6} style={{ textAlign: 'center' }}>
                                        <img
                                            src={booking.show.movie.poster}
                                            alt={booking.show.movie.title}
                                            style={{
                                                width: '50%',
                                                height: '50%',
                                                objectFit: 'cover',
                                                objectPosition: 'top',
                                                borderRadius: '8px',
                                                maxHeight: '100%' // avoids overflow
                                            }}
                                        />
                                    </Col>

                                    {/* Booking Info */}
                                    <Col xs={24} sm={18}>
                                        <div style={{
                                            backgroundColor: '#f5f5f5',
                                            padding: '16px',
                                            borderRadius: '8px',
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center'
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <h2 style={{ margin: 0 }}>{booking.show.movie.title}</h2>
                                                <span style={{
                                                    padding: '4px 12px',
                                                    backgroundColor: moment(`${booking.show.showDate} ${booking.show.showTime}`).isAfter(moment()) ? '#52c41a' : '#ff4d4f',
                                                    color: '#fff',
                                                    borderRadius: '12px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 500
                                                }}>
                                                    {moment(`${booking.show.showDate} ${booking.show.showTime}`).isAfter(moment()) ? 'Upcoming' : 'Completed'}
                                                </span>
                                            </div>

                                            <p><strong>Ticket ID:</strong> {booking._id}</p>
                                            <p><strong>Theatre:</strong> {booking.show.theatre.name}</p>
                                            <p><strong>Show:</strong> {booking.show.showDate} at {booking.show.showTime}</p>
                                            <p><strong>Seats:</strong> {booking.seats.join(', ')}</p>
                                            <p><strong>Booked On:</strong> {moment(booking.createdAt).format('MMMM Do YYYY, h:mm A')}</p>
                                        </div>
                                    </Col>
                                </Row>
                            </Card>

                        </Col>
                    ))}
                </Row>
            ) : (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <h2>No bookings yet</h2>
                    <Link to="/book-show">
                        <Button type="primary">Book a Show</Button>
                    </Link>
                </div>
            )}
        </div>
    );
}

export default Bookings;
