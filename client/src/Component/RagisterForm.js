import React from 'react';
import {useFormik } from 'formik';
// import * as Yup from 'yup';
import { NavLink, useHistory } from 'react-router-dom';
import { useEffect } from 'react';
import queryString from 'query-string';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register_user, edit_User, update_User, country, state, city,  } from '../Actions/userAction';
import { uniqueId } from 'lodash';


const RegForm = () => {
    //Get Edited User Id
    const { id } = queryString.parse(window.location.search);

    ///////////////////For Navigate Page ////////////
    const history = useHistory();

    //////////////// Dispatch the Api Request ///////////////////
    const dispatch = useDispatch();

    //////////////////////////////////// useState Start /////////////////////////

    const [countryId, setCountryId] = useState('') //Set Country Id
    const [stateId, setStateId] = useState('') // Set State Id
    const [cityId, setCityId] = useState('')    // Set City Id
    const [employee, setEmployee] = useState([]) //For store the Edited User Data

    //////////////////////////////////// useState End /////////////////////////

    //////////////////////////////// Get responce of the Api Requeste ////////////////////////////////
    const userList = useSelector(state => state.userList)

    const countryData = useSelector(state => state.countryData)
    const stateData = useSelector(state => state.stateData)
    const cityData = useSelector(state => state.cityData)

    //////////////////////////////// Formik Values ///////////////////////////////
    
    // const validationSchema = Yup.object().shape({
    //     name: Yup.string()
    //         .max(20, 'Must be 20 characters or less')
    //         .required('Enter Your Name'),
        
    //     phone: Yup.number()
    //         .max(12, 'Must be 12 digits or less')
    //         .required('Enter Your Phone'),
        
    //     profession: Yup.string()
    //         .profession('Profession is not valid!')
    //         .required('Enter Your Profession'),
        
    //     salary1: Yup.number()
    //         .salary1('invalid')
    //         .required('Enter Your salary1'),
        
    //     salary2: Yup.number()
    //         .salary2('invalid')
    //         .required('Enter Your salary2'),
        
    //     salary3: Yup.number()
    //         .salary3('invalid')
    //         .required('Enter Your salary3'),
        
    //     totalsalary: Yup.string()
    //         .totalsalary('invalid')
    //         .required('required'),
        
    //     email: Yup.string()
    //         .email('E-mail is not valid!')
    //         .required('E-mail is required!'),
        
    //     password: Yup.string()
    //         .min(6, 'must be 6 at least character')
    //         .required('Password is required!'),
        
    //     confirmpassword: Yup.string()
    //         .oneOf([Yup.ref('password'), null], 'Password must match')
    //         .required('Password is required!'),
        
    //     countryId: Yup.string()
    //         .countryId('countryid is not valid')
    //         .required('Countr is required'),
        
    //     stateId: Yup.string()
    //         .stateId('stateid is not valid')
    //         .required('State is required'),
        
    //     cityId: Yup.string()
    //         .cityId('cityid is not valid')
    //         .required('City is required'),
    // })

    const formik = useFormik({
        initialValues: {
            name: "",
            phone: "",
            profession: "",
            salary1: "",
            salary2: "",
            salary3: "",
            totalsalary: "",
            email: "",
            password: "",
            confirmpassword: "",
            countryId: "",
            stateId: "",
            cityId: ""
        },        

        onSubmit: (values) => {
            if (id) {
                dispatch(update_User(id, values))
                history.push('/dashbord')
                // for add new User
            } else {
                console.log(values);
                dispatch(register_user(values))
                history.push('/loginpage')
                formik.handleReset()
            }
        },        
    });    
    // <Formik
    //     validationSchema={validationSchema}
    //     render={RegForm}
    // />
    
    
    
    //////////////////////////////// get selectedEdit object ////////////////////////////////
    useEffect(() => {
        if (id) {
            console.log("editid",id);
            dispatch(edit_User(id))
            setEmployee(userList)
        }
    }, [])

    //////////////////////////////// set update values ////////////////////////////////
    useEffect(() => {
        if (id && userList) {
            formik.setValues(userList)
        }
    }, [userList])

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

    return (
        <>
            <div>
                    <h1>Registration Form</h1>                    
                <form onSubmit={formik.handleSubmit}>                    
                    <input type="text"
                        name="name"
                        placeholder='Enter Employee Name'
                        onChange={formik.handleChange}
                        value={formik.values.name} required
                    /><br />
                    {/* <ErrorMessage name='name' /> */}
                    
                    <input type="number"
                        name="phone"
                        placeholder='Enter Phone'
                        onChange={formik.handleChange}
                        value={formik.values.phone} required
                    /><br />
                    
                    <input type="text"
                        name='profession'
                        placeholder='Enter Profession'
                        onChange={formik.handleChange}
                        value={formik.values.profession} required
                    /><br />

                    <input type="text"
                        name='salary1'
                        placeholder='Enter Salary1'
                        onChange={formik.handleChange}
                        value={formik.values.salary1} required
                    /><br />

                    <input type="text"
                        name='salary2'
                        placeholder='Enter Salary2'
                        onChange={formik.handleChange}
                        value={formik.values.salary2} required
                    /><br />

                    <input type="text"
                        name='salary3'
                        placeholder='Enter Salary3'
                        onChange={formik.handleChange}
                        value={formik.values.salary3} required
                    /><br />

                    <input type="text"
                        name='totalsalary'
                        placeholder='Total Salary'
                        onChange={formik.handleChange}
                        value={formik.values.totalsalary} required
                        readOnly={true}
                    /><br />
                                       
                    <input type="text"
                        name='email'
                        placeholder='Enter Email'
                        onChange={formik.handleChange} unique
                        value={formik.values.email} required
                    /><br />
                    
                    <input type="password"
                        name='password'
                        placeholder='Enter Password'
                        onChange={formik.handleChange}
                        value={formik.values.password} required
                    /><br />
                    
                    <input type="password"
                        name='confirmpassword'
                        placeholder='Enter Confirm Password'
                        onChange={formik.handleChange}
                        value={formik.values.confirmpassword} required 
                    /><br />

                    <select className='dropdown' name="countryId" onChange={(e) => countryChange(e)}>
                        <option value="" disabled selected>Select Country</option>
                        {countryData.map((elem) => {
                            return (
                                <option value={elem._id} key={elem._id}>{elem.countryName}</option>
                            )
                        })} 
                    </select><br />

                    <select className='dropdown' name="stateId"   onChange={(e) => stateChange(e)}>
                        <option value="" disabled selected>Select State</option>
                        {stateData.map((elem) => {
                            return (
                                <option value={elem._id} key={elem._id}>{ elem.stateName}</option>                        
                            )
                        })}                          
                    </select><br /> 

                    <select className='dropdown' name= "cityId"  onChange={(e) => cityChange(e)}>
                        <option value="" disabled selected>Select City</option>
                        {cityData.map((elem) => {
                            return (
                                <option value={elem._id} key={elem._id}>{elem.cityName}</option>        
                            )
                        })}                        
                    </select><br />                                       

                    {!id ? (
                       <button className='signIn'>Submit</button> ) :
                            (<button className='signIn'>Update</button>)} 
                    
                    <button onClick={formik.handleReset} className='cancel'>Cancel</button>
                </form><br />
                
                <div className=''>
                    <p>already registered <NavLink to='/loginpage'>Login</NavLink></p>                    
                </div>
            </div>
        </>
    )
}

export default RegForm