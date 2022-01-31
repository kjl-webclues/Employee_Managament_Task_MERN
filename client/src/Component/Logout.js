import React from 'react'
import { useHistory } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import {logout_User} from '../Actions/userAction'



const Logout = () => {
    const history = useHistory()
    
    const Apidispatch = useDispatch();

    useEffect(() => {
        Apidispatch(logout_User());
        history.push('loginpage')
    }, [])
 
    return (
        <>

        </>
        
    )
}

export default Logout