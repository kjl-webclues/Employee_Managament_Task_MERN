import React from "react";
import { useFormik } from "formik";
import { useDispatch } from 'react-redux';
import {login_User} from '../Actions/userAction'
import { useHistory } from "react-router-dom";


const LoginForm = () => {
    
    const Apidispatch = useDispatch();

    const history = useHistory()

    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        onSubmit: (values) => {
            console.log("values", values);
            // for employee login             
            Apidispatch(login_User(values))
            history.push('/dashbord')           
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
                            value={formik.values.email}
                        /><br />
                        
                        <input type="password"
                            name="password"
                            placeholder='Enter Password'
                            onChange={formik.handleChange}
                            value={formik.values.password}
                        /><br />
                        <button className='login' type='submit'>Login</button>                    
                    </form>
            </div>
        </>
    )
}
export default LoginForm