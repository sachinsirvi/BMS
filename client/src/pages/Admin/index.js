import React, { useEffect, useState } from 'react';
import { Tabs, message } from 'antd';
import MovieList from './MovieList';
import TheatresTable from './TheatresTable';
import PartnersTable from './PartnersTable';
import { getAllTheatres, updateTheatreStatus } from '../../api/theatres';
import { GetAllPartners , ApprovePartner, RejectPartner} from '../../api/users';
import { useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '../../redux/loaderSlice';

function Admin() {
    const dispatch = useDispatch();
    const [theatres, setTheatres] = useState([]);
    const [partners, setPartners] = useState([]);

    const fetchTheatres = async () => {
        try {
            dispatch(showLoading());
            const response = await getAllTheatres();
            if (response.success) {
                setTheatres(response.data);
            } else {
                message.error(response.message);
            }
            dispatch(hideLoading());
        } catch (error) {
            dispatch(hideLoading());
            message.error(error.message);
        }
    };

    const fetchPartners = async () => {
        try {
            dispatch(showLoading());
            const response = await GetAllPartners();
            if (response.success) {
                setPartners(response.data);
            } else {
                message.error(response.message);
            }
            dispatch(hideLoading());
        } catch (error) {
            dispatch(hideLoading());
            message.error(error.message || "Failed to fetch partners");
        }
    };

    useEffect(() => {
        fetchTheatres();
        fetchPartners();
    }, []);

    const handleApprove = async (record) => {
        try {
            dispatch(showLoading());
            const response = await updateTheatreStatus(record._id, true);
            if (response.success) {
                message.success("Theatre approved");
                fetchTheatres();
            } else {
                message.error(response.message);
            }
            dispatch(hideLoading());
        } catch (err) {
            dispatch(hideLoading());
            message.error(err.message || "Approval failed");
        }
    };

    const handleReject = async (record) => {
        try {
            dispatch(showLoading());
            const response = await updateTheatreStatus(record._id, false);
            if (response.success) {
                message.success("Theatre rejected");
                fetchTheatres();
            } else {
                message.error(response.message);
            }
            dispatch(hideLoading());
        } catch (err) {
            dispatch(hideLoading());
            message.error(err.message || "Rejection failed");
        }
    };

    const handlePartnerApprove = async (record) => {
        try {
            dispatch(showLoading());
            const response = await ApprovePartner(record._id);
            if (response.success) {
                message.success("Partner approved successfully");
                fetchPartners();
            } else {
                message.error(response.message);
            }
            dispatch(hideLoading());
        } catch (err) {
            dispatch(hideLoading());
            message.error(err.message || "Approval failed");
        }
    };

    const handlePartnerReject = async (record) => {
        try {
            dispatch(showLoading());
            const response = await RejectPartner(record._id); 
            if (response.success) {
                message.success("Partner rejected");
                fetchPartners(); 
            } else {
                message.error(response.message);
            }
            dispatch(hideLoading());
        } catch (err) {
            dispatch(hideLoading());
            message.error(err.message || "Rejection failed");
        }
    };

    const tabItems = [
        {
            key: '1',
            label: 'Movies',
            children: <MovieList />,
        },
        {
            key: '2',
            label: 'Theaters',
            children: (
                <TheatresTable
                    theatres={theatres}
                    onApprove={handleApprove}
                    onReject={handleReject}
                />
            ),
        },
        {
            key: '3',
            label: 'Partners',
            children: (
                <PartnersTable
                    partners={partners}
                    onApprove={handlePartnerApprove}
                    onReject={handlePartnerReject}
                />
            ),
        }  
    ];

    return (
        <>
            <h1>Admin Dashboard</h1>
            <Tabs items={tabItems} />
        </>
    );
}

export default Admin;
