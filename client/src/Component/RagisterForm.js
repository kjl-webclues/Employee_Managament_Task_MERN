import React from 'react';
import { useFormik } from 'formik';
import { NavLink, useHistory } from 'react-router-dom';
import { useEffect } from 'react';
import queryString from 'query-string';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register_user, edit_User, update_User, country, state, city,  } from '../Actions/userAction';


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

    //////////////////////////////// Formik Values ////////////////////////////////
    const formik = useFormik({
        initialValues: {
            name: "",
            phone: "",
            profession: "",
            salary1: "",
            salary2: "",
            salary3:"",
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
        }         
    });
    
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
                    
                    <input type="number"
                        name="phone"
                        placeholder='Enter phone'
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
                        placeholder='Enter salary1'
                        onChange={formik.handleChange}
                        value={formik.values.salary1} required
                    /><br />

                    <input type="text"
                        name='salary2'
                        placeholder='Enter Profession'
                        onChange={formik.handleChange}
                        value={formik.values.salary2} required
                    /><br />

                    <input type="text"
                        name='salary3'
                        placeholder='Enter Profession'
                        onChange={formik.handleChange}
                        value={formik.values.salary3} required
                    /><br />
                                       
                    <input type="text"
                        name='email'
                        placeholder='Enter Email'
                        onChange={formik.handleChange}
                        value={formik.values.email} required
                    /><br />
                    
                    <input type="password"
                        name='password'
                        placeholder='Enter password'
                        onChange={formik.handleChange}
                        value={formik.values.password} required
                    /><br />
                    
                    <input type="password"
                        name='confirmpassword'
                        placeholder='Enter confirm password'
                        onChange={formik.handleChange}
                        value={formik.values.confirmpassword} required
                    /><br />

                    <select className='dropdown' name="countryId" onChange={(e) => countryChange(e)}>
                        <option value="" disabled selected>Select Country</option>
                        {countryData.map((elem) => {
                            return (
                                <option value={elem._id} key={elem._id}>{elem.countryName}</option>
                            )
                        })} required
                    </select><br />

                    <select className='dropdown' name="stateId"   onChange={(e) => stateChange(e)}>
                        <option value="" disabled selected>Select State</option>
                        {stateData.map((elem) => {
                            return (
                                <option value={elem._id} key={elem._id}>{ elem.stateName}</option>                        
                            )
                        })} required                         
                    </select><br /> 

                    <select className='dropdown' name= "cityId"  onChange={(e) => cityChange(e)}>
                        <option value="" disabled selected>Select City</option>
                        {cityData.map((elem) => {
                            return (
                                <option value={elem._id} key={elem._id}>{elem.cityName}</option>        
                            )
                        })} required                       
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