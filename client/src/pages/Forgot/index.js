import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ForgotPassword } from '../../api/users';
import { showLoading, hideLoading } from '../../redux/loaderSlice';
import { useDispatch, useSelector } from 'react-redux';

function ForgotPass() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.loaders); // for disabling button

    const onFinish = async (values) => {
        try {
            dispatch(showLoading());
            const response = await ForgotPassword(values);
            dispatch(hideLoading());

            if (response.success) {
                message.success(response.message || "OTP Sent, Please check your mail");
                navigate("/reset-password");
            } else {
                message.error(response.message || "Something went wrong");
            }
        } catch (error) {
            dispatch(hideLoading());
            const msg = error?.response?.data?.message || "Something went wrong";
            message.error(msg);
        }
    };

    return (
        <main className='App-header'>
            <h1>Forgot Password</h1>
            <section className="mw-500 text-center px-3">
                <Form layout='vertical' onFinish={onFinish}>
                    <Form.Item
                        label="Email"
                        name="email"
                        className='d-block'
                        rules={[
                            { required: true, message: 'Please enter your email' },
                            { type: "email", message: 'Please enter a valid email' }
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item className='d-block'>
                        <Button
                            type="primary"
                            block
                            htmlType="submit"
                            loading={loading} // disables & shows spinner on button
                            style={{ fontSize: "1rem", fontWeight: "600" }}
                        >
                            Send OTP
                        </Button>
                    </Form.Item>
                </Form>
            </section>
        </main>
    );
}

export default ForgotPass;
