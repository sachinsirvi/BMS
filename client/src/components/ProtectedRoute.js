import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { showLoading, hideLoading } from '../redux/loaderSlice';
import { setUser } from '../redux/userSlice';
import { GetCurrentUser } from '../api/users';
import { message, Layout, Menu, Spin } from 'antd';
import {
  HomeOutlined,
  UserOutlined,
  LogoutOutlined,
  ProfileOutlined,
} from '@ant-design/icons';

function ProtectedRoute({ children, requiredRole }) {
  const { user } = useSelector((state) => state.users); 
  const [authorized, setAuthorized] = useState(false); 
  const [loading, setLoading] = useState(true); 
  const dispatch = useDispatch(); 
  const navigate = useNavigate(); 

  useEffect(() => {
    const checkAccess = async () => {
      // Authentication Check 
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      // Validate Token via Backend
      try {
        dispatch(showLoading()); 
        const res = await GetCurrentUser(); 
        dispatch(setUser(res.data)); 
        dispatch(hideLoading());

        // Role validation
        let hasAccess = false;

        if (!requiredRole) {
          hasAccess = true;
        } else if (res.data.role === requiredRole) {
          hasAccess = true;
        } else {
          hasAccess = false;
        }

        if (hasAccess) {
          setAuthorized(true);
        } else {
          message.destroy(); 
          message.error('Unauthorized access');
          navigate('/');
        }
      } catch (err) {
        dispatch(hideLoading());
        message.destroy();
        message.error(err.response?.data?.message || 'Session expired');
        navigate('/login');
      } finally { // if an error happens in try or catch spinner will always show, thus to make it false we need finally, that no matter what run this
        setLoading(false);
      }
    };
    checkAccess(); 
  }, [dispatch, navigate, requiredRole]);

  const { Header, Content, Footer } = Layout;

  const navItems = [
    {
      label: 'Home',
      key: 'home',
      icon: <HomeOutlined />,
    },
    {
      label: user?.name || 'guest',
      key: 'user',
      icon: <UserOutlined />,
      children: [
        {
          label: 'My Profile',
          key: 'profile',
          icon: <ProfileOutlined />,
        },
        {
          label: 'Logout',
          key: 'logout',
          icon: <LogoutOutlined />,
        },
      ],
    },
  ];

  // Loading state
  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Spin size="large" />
      </div>
    );
  }

  // Block rendering if unauthorized
  if (!authorized || !user) return null;

  return (
    <Layout style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      <Header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1,
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 24px',
          background: '#001529',
          boxShadow: '0 2px 8px #00000040',
        }}
      >
        <Link to="/" style={{ textDecoration: 'none' }}>
          <h3 style={{ color: '#fff', margin: 0 }}>BookMyShow</h3>
        </Link>
        <Menu
          mode="horizontal"
          theme="dark"
          items={navItems}
          onClick={({ key }) => {
            if (key === 'home') {
              navigate('/');
            }
            if (key === 'profile') {
              if (user?.role === 'admin') {
                navigate('/admin');
              } else if (user?.role === 'partner') {
                navigate('/partner');
              } else if (user?.role === 'user') {
                if (user?.partnerStatus === 'approved') {
                  navigate('/partner');
                } else if (user?.partnerStatus === 'pending') {
                  navigate('/pending-partner');
                } else {
                  navigate('/profile');
                }
              } else {
                navigate('/'); 
              }
            }
            if (key === 'logout') {
              localStorage.removeItem('token');
              dispatch(setUser(null));
              navigate('/login');
            }
          }} />
      </Header>

      <Content style={{ flex: 1, padding: '24px' }}>
        {children}
      </Content>

      <Footer
        style={{
          backgroundColor: '#001529',
          color: '#fff',
          fontSize: '14px',
          padding: '10px 40px',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '10px',
          textAlign: 'center',
        }}
      >
        <span>© {new Date().getFullYear()} BookMyShowClone. Built with <span style={{ color: 'red' }}>❤️</span> by <strong>Sachin</strong></span>
      </Footer>
      
    </Layout>
  );
}

export default ProtectedRoute;
