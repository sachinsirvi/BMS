import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { LoginUser } from '../../api/users';

function Login() {
    const navigate = useNavigate()
    const onFinish = async (values) => {
        try {
            const response = await LoginUser(values);
            if (response.success) {
                localStorage.setItem("token", response.data.token);  // token sent from backend
                message.success(response.message || "Login successful");
                navigate("/");
            } else {
                message.error(response.message || "Something went wrong");
            }
        } catch (error) {
            const msg = error?.response?.data?.message || "Something went wrong";
            message.error(msg);
        }
    };

    return (
        <main className='App-header'>
            <h1>Login To BookMyShow</h1>
            <section className="mw-500 text-center px-3">
                <Form layout='vertical' onFinish={onFinish}>
                    <Form.Item
                        label="Email"
                        name="email"
                        className='d-block'
                        rules={[{ required: true, message: 'Please enter your email' },
                        { type: "email", message: 'Please enter a valid email' }
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        className='d-block'
                        rules={[{ required: true, message: 'Please enter your password' }]}>
                        <Input.Password />
                    </Form.Item>

                    <Form.Item className='d-block'>
                        <Button
                            type="primary"
                            block
                            htmlType="submit"
                            style={{ fontSize: "1rem", fontWeight: "600" }}
                        >
                            Login
                        </Button>
                    </Form.Item>
                </Form>
                <p> New User? <Link to='/register'> Register </Link></p>
                <p> Forgot Password? <Link to="/forgot-password"> Reset Password </Link></p>
            </section>
        </main>
    )
}

export default Login;