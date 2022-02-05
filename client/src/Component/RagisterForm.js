import React from 'react';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import { NavLink, useHistory } from 'react-router-dom';
import { useEffect } from 'react';
import queryString from 'query-string';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register_user, edit_User, update_User, country, state, city, register_Toggle,  } from '../Actions/userAction';
import { toast } from 'react-toastify';


const RegForm = () => {
    //Get Edited User Id
    const { id } = queryString.parse(window.location.search);
    //console.log(id);

    ///////////////////For Navigate Page ////////////
    const history = useHistory();

    //////////////// Dispatch the Api Request ///////////////////
    const dispatch = useDispatch();

    //////////////////////////////////// useState Start /////////////////////////

    const [countryId, setCountryId] = useState('') //Set Country Id
    const [stateId, setStateId] = useState('') // Set State Id
    const [cityId, setCityId] = useState('')    // Set City Id
    const [employee, setEmployee] = useState([]) //For store the Edited User Data

    //console.log(employee.email)

    //////////////////////////////////// useState End /////////////////////////

    //////////////////////////////// Get responce of the Api Requeste ////////////////////////////////
    // const userList = useSelector(state => state.userList)
    const userData = useSelector(state => state.userData) //maping state

    const countryData = useSelector(state => state.countryData)
    const stateData = useSelector(state => state.stateData)
    const cityData = useSelector(state => state.cityData)
    const emailExist = useSelector(state => state.emailExist)
    const registerToggle = useSelector(state => state.registerToggle)


    //////////////////////////////// Define HandleChange Function of Dropdown ////////////////////////////////
    const countryChange = (e) => {
        formik.values.countryId = e.target.value
        setCountryId(e.target.value)
    }

    const stateChange = (e) => {
        formik.values.stateId = e.target.value
        setStateId(e.target.value)
    }

    const cityChange = (e) => {
        formik.values.cityId = e.target.value
        setCityId(e.target.value)
    }

    
    //////////////////////////////// Yup Validation ///////////////////////////////
    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .max(20, 'Must be 20 characters or less')
            .required('Name is Required'),
        
    phone: Yup.string()
            .min(10, 'Must be 10 digits or less')
            .max(12, 'Must be 12 digits or less')
            .required('Enter Your Phone'),
        
        profession: Yup.string()
            .required('Profession is not valid!'),
        
        salary1: Yup.number()
            .required('Enter Your salary1'),
        
        salary2: Yup.number()
            .required('Enter Your salary2'),
        
        salary3: Yup.number()
            .required('Enter Your salary3'),
        
        email: Yup.string()
            .email('E-mail is not valid!')
            .required('E-mail is required!'),
        
        password: Yup.string()
            .min(6, 'must be 6 at least character')
            .required('Password is required!'),
        
        confirmpassword: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Password must match')
            .required('Password is required!'),
        
        countryId: Yup.string()
            .required('Countr is required'),
        
        stateId: Yup.string()
            .required('State is required'),
        
        cityId: Yup.string()
            .required('City is required'),
    })
    //////////////////////////////// Formik Values ///////////////////////////////
     const initialValues = {
            name: "",
            phone: "",
            profession: "",
            salary1: "",
            salary2: "",
            salary3: "",
            email: "",
            password: "",
            confirmpassword: "",
            countryId: "",
            stateId: "",
            cityId: ""
    }
    const formik = useFormik({
        initialValues,
        validationSchema, 
        onSubmit: (values) => {
            if (id) {
                    dispatch(update_User(id, values, employee.email))
                // for add new User
            } else {
                if (values.password !== values.confirmpassword) {
                    toast.warning("Password Dose Not match")
                } else {
                        dispatch(register_user(values))
                        //history.push('/loginpage')
                        formik.handleReset()                    
                }                
            }
        },                        
    });
    
    useEffect(() => {
        if (emailExist === true) {
            history.push('/dashbord')
        }
    }, [emailExist])

    //////////////////////////////// Register Toggle //////////////////////////////// 
    useEffect(() => {
        if (registerToggle === true) {
            history.push('/loginpage')
            dispatch(register_Toggle());
        }
    }, [registerToggle])

    //////////////////////////////// get selectedEdit object ////////////////////////////////
    
    useEffect(() => {
        if (id) {
            // dispatch(edit_User(id))
            setEmployee(edit_User)
            
        }
    }, [])
    const edit_User = userData.find((elem) => elem._id === id ? elem : null);
    const countryEdit = edit_User && edit_User.country.map(item => item.countryName)
    const stateEdit = edit_User && edit_User.state.map(item => item.stateName)
    const cityEdit = edit_User && edit_User.city.map(item => item.cityName)

    //////////////////////////////// set update values ////////////////////////////////
    useEffect(() => {
        if (id && employee) {
            formik.setValues(employee)
        }
    }, [employee])

    //////////////////////////////// Dispatch Api Dropdown ////////////////////////////////
    useEffect(() => {
        dispatch(country())
    }, [dispatch])
    
    useEffect(() => {
        dispatch(state(countryId))
    }, [countryId, dispatch])

    useEffect(() => {
        dispatch(city(stateId))
    }, [stateId, dispatch])
    return (
        <>
            <div>
                    <h1>Registration Form</h1>                    
                <form onSubmit={formik.handleSubmit}>                    
                    <input type="text"
                        name="name"
                        placeholder='Enter Employee Name'
                        onChange={formik.handleChange}
                        {...formik.getFieldProps("name")}
                        //style={{borderColor: errors.name && touched.name ? 'red' : 'inherit'}}

                    /><br />
                    {formik.touched.name && formik.errors.name ? (
                        <div className="fv-plugins-message-container">
                            <div className="fv-help-block error">
                                {formik.errors.name}
                            </div>
                        </div>
                    ) : null}
                    
                    <input type="number"
                        name="phone"
                        placeholder='Enter Phone'
                        onChange={formik.handleChange}
                        // value={formik.values.phone} required
                        {...formik.getFieldProps("phone")}
                    /><br />
                    {formik.touched.phone && formik.errors.phone ? (
                        <div className="fv-plugins-message-container">
                            <div className="fv-help-block error">
                                {formik.errors.phone}
                            </div>
                        </div>
                    ) : null}
                    
                    <input type="text"
                        name='profession'
                        placeholder='Enter Profession'
                        onChange={formik.handleChange}
                        // value={formik.values.profession} required
                        {...formik.getFieldProps("profession")}
                    /><br />
                    {formik.touched.profession && formik.errors.profession ? (
                        <div className="fv-plugins-message-container">
                            <div className="fv-help-block error">
                                {formik.errors.profession}
                            </div>
                        </div>
                    ) : null}

                    <input type="text"
                        name='salary1'
                        placeholder='Enter Salary1'
                        onChange={formik.handleChange}
                        // value={formik.values.salary1} required
                        {...formik.getFieldProps("salary1")}
                    /><br />
                    {formik.touched.salary1 && formik.errors.salary1 ? (
                        <div className="fv-plugins-message-container">
                            <div className="fv-help-block error">
                                {formik.errors.salary1}
                            </div>
                        </div>
                    ) : null}

                    <input type="text"
                        name='salary2'
                        placeholder='Enter Salary2'
                        onChange={formik.handleChange}
                        // value={formik.values.salary2} required
                        {...formik.getFieldProps("salary2")}
                    /><br />
                    {formik.touched.salary2 && formik.errors.salary2 ? (
                        <div className="fv-plugins-message-container">
                            <div className="fv-help-block error">
                                {formik.errors.salary2}
                            </div>
                        </div>
                    ) : null}

                    <input type="text"
                        name='salary3'
                        placeholder='Enter Salary3'
                        onChange={formik.handleChange}
                        // value={formik.values.salary3} required
                        {...formik.getFieldProps("salary3")}
                    /><br />
                    {formik.touched.salary3 && formik.errors.salary3 ? (
                        <div className="fv-plugins-message-container">
                            <div className="fv-help-block error">
                                {formik.errors.salary3}
                            </div>
                        </div>
                    ) : null}

                    <input type="number" placeholder="Total Salary"
                        value={parseInt(formik.values.salary1) + parseInt(formik.values.salary2) + parseInt(formik.values.salary3)} readOnly>                        
                    </input><br />
                                       
                    <input type="text"
                        name='email'
                        placeholder='Enter Email'
                        onChange={formik.handleChange} unique
                        // value={formik.values.email} required
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
                        name='password'
                        placeholder='Enter Password'
                        onChange={formik.handleChange}
                        // value={formik.values.password} required
                        {...formik.getFieldProps("password")}
                    /><br />
                    {formik.touched.password && formik.errors.password ? (
                        <div className="fv-plugins-message-container">
                            <div className="fv-help-block error">
                                {formik.errors.password}
                            </div>
                        </div>
                    ) : null}
                    
                    <input type="password"
                        name='confirmpassword'
                        placeholder='Enter Confirm Password'
                        onChange={formik.handleChange}
                        // value={formik.values.confirmpassword} required
                        {...formik.getFieldProps("confirmpassword")}

                    /><br />
                    {formik.touched.confirmpassword && formik.errors.confirmpassword ? (
                        <div className="fv-plugins-message-container">
                            <div className="fv-help-block error">
                                {formik.errors.confirmpassword}
                            </div>
                        </div>
                    ) : null}

                    <select className='dropdown' name="countryId" {...formik.getFieldProps("countryId")}  onChange={(e) => countryChange(e)}>
                        <option>{countryEdit ? countryEdit: "Select Country"}</option>
                        {countryData.map((elem) => {
                            return (
                                <option value={elem._id} key={elem._id}>{elem.countryName}</option>
                            )
                        })} 
                    </select><br />
                    {formik.touched.countryId && formik.errors.countryId ? (
                        <div className="fv-plugins-message-container">
                            <div className="fv-help-block error">
                                {formik.errors.countryId}
                            </div>
                        </div>
                    ) : null}

                    <select className='dropdown' name="stateId" {...formik.getFieldProps("stateId")}   onChange={(e) => stateChange(e)}>
                        <option>{stateEdit ? stateEdit: "Select State"}</option>
                        {stateData.map((elem) => {
                            return (
                                <option value={elem._id} key={elem._id}>{ elem.stateName}</option>                        
                            )
                        })}                          
                    </select><br />
                    {formik.touched.stateId && formik.errors.stateId ? (
                        <div className="fv-plugins-message-container">
                            <div className="fv-help-block error">
                                {formik.errors.stateId}
                            </div>
                        </div>
                    ) : null}

                    <select className='dropdown' name="cityId" {...formik.getFieldProps("cityId")}  onChange={(e) => cityChange(e)}>
                        <option>{cityEdit ? cityEdit: "Select City"}</option>
                        {cityData.map((elem) => {
                            return (
                                <option value={elem._id} key={elem._id}>{elem.cityName}</option>        
                            )
                        })}                        
                    </select><br />
                    {formik.touched.cityId && formik.errors.cityId ? (
                        <div className="fv-plugins-message-container">
                            <div className="fv-help-block error">
                                {formik.errors.cityId}
                            </div>
                        </div>
                    ) : null}

                    {!id ? (
                       <button className='signIn' type='submit'>Submit</button> ) :
                            (<button className='signIn' type='update'>Update</button>)} 
                    
                    <button onClick={formik.handleReset} className='cancel'>Cancel</button>
                </form><br />
                
                <div>   
                    {
                        id ? null : <p>already registered <NavLink to='/loginpage'>Login</NavLink></p>
                    } 
                     
                </div>
            </div>
        </>
    )
}

export default RegForm