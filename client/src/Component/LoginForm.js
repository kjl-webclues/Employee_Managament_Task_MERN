import React from "react";
import { useFormik } from "formik";
import { useDispatch } from 'react-redux';
import { login_User } from '../Actions/userAction'
import * as Yup from 'yup'


const LoginForm = () => {
    
    const Apidispatch = useDispatch();

    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .email('E-mail is not valid!')
            .required('E-mail is required!'),
        
        password: Yup.string()
            .required('Password is required!'),
    })
    const initialValues = {
            email: '',
            password: ''
        }

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values) => {            
                Apidispatch(login_User(values))             
        }
    })
 
    return (
        <>
            <div>            
                    <h2>Login Form</h2>
                    <form className="loginForm" onSubmit={formik.handleSubmit}>
                        <input type="text"
                            name="email"
                            placeholder='Enter Email Address'
                            onChange={formik.handleChange}
                            //value={formik.values.email}
                        {...formik.getFieldProps("email")}
                    /><br />
                    {formik.touched.email && formik.errors.email ? (
                        <div className="fv-plugins-message-container">
                            <div className="fv-help-block error">
                                {formik.errors.email}
                            </div>
                        </div>
                    ) : null}
                        
                        <input type="password"
                            name="password"
                            placeholder='Enter Password'
                            onChange={formik.handleChange}
                            //value={formik.values.password}
                        {...formik.getFieldProps("password")}
                    /><br />
                    {formik.touched.password && formik.errors.password ? (
                        <div className="fv-plugins-message-container">
                            <div className="fv-help-block error">
                                {formik.errors.password}
                            </div>
                        </div>
                    ) : null}

                        <button className='login' type='submit' >Login</button>                    
                    </form>
            </div>
        </>
    )
}
export default LoginForm