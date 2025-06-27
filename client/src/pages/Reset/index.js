import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { ResetPassword } from '../../api/users';

function ResetPass() {
    const navigate = useNavigate()
    const onFinish = async (values) => {
        try {
            const response = await ResetPassword(values);
            if (response.success) {
                message.success(response.message || "Password Reset Successfully");
                navigate("/login");
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
            <h1>Reset Password</h1>
            <section className="mw-500 text-center px-3">
                <Form layout='vertical' onFinish={onFinish}>
                    <Form.Item
                        label="New Password"
                        name="newPassword" // as per backend api
                        className='d-block'
                        rules={[{ required: true, message: 'Please enter your new password' },
                        { type: "password", message: 'Please enter a valid password' }
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        label="OTP"
                        name="otp"
                        className='d-block'
                        rules={[{ required: true, message: 'Please enter OTP' },
                        ]}
                    >
                        <Input.OTP />
                    </Form.Item>
                    <Form.Item className='d-block'>
                        <Button
                            type="primary"
                            block
                            htmlType="submit"
                            style={{ fontSize: "1rem", fontWeight: "600" }}
                        >
                            Reset Password
                        </Button>
                    </Form.Item>
                </Form>
        
            </section>
        </main>
    )
}

export default ResetPass;