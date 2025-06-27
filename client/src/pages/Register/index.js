import React from 'react';
import { Form, Button, Input, message, Radio } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { RegisterUser } from '../../api/users';

function Register() {
    const navigate = useNavigate();
    const onFinish = async (values) => {
        const { confirmPassword, password } = values;
        if (password !== confirmPassword) {
            return message.error("Passwords do not match");
        }
        const { confirmPassword: _, ...formData } = values;
        try {
            const response = await RegisterUser(formData)
            if (response.success) {
                message.success(response.message || 'Registration successful')
                navigate('/login')
            }
            else {
                message.error(response.message || 'Something went wrong')
            }
        } catch (error) {
            const msg = error?.response?.data?.message || "Something went wrong";
            message.error(msg);
        }
    }

    return (
        <main className='App-header'>
            <h1>Register To BookMyShow</h1>
            <section className="mw-500 text-center px-3">
                <Form layout='vertical' onFinish={onFinish}>
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: 'Please enter your name' }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: 'Please enter your email' },
                        { type: "email", message: "Please enter a valid email" }
                        ]}>
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[
                            { required: true, message: 'Please enter your password' },
                            {
                                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
                                message: 'Password must be at least 8 characters and include uppercase, lowercase, and a number'
                            }
                        ]}>
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        label="Confirm Password"
                        name="confirmPassword"
                        rules={[{ required: true, message: 'Please re-enter your password' }]}>
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        label="Register as a partner"
                        name="isPartner"
                    >
                        <Radio.Group defaultValue={false}>
                            <Radio value={true}>Yes</Radio>
                            <Radio value={false}>No</Radio>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item >
                        <Button
                            type="primary"
                            block
                            htmlType='submit'
                            style={{ fontSize: "1rem", fontWeight: "600" }}
                        >
                            Register
                        </Button>
                    </Form.Item>

                </Form>
            </section>
            <p>
                Already Registered? <Link to="/login"> Login </Link>
            </p>
        </main>
    )
}

export default Register;