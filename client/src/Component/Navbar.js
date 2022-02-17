import React from 'react'
import { NavLink } from 'react-router-dom';
import { useSelector } from "react-redux"


const Navbar = () => {  
    
    const loginStatus = useSelector(state => state.loginStatus)
    const loader = useSelector(state => state.loader)
    
    return (
    <div className='nav-div'>
    {
            loginStatus === true ? (
                <>
                    {loader ? <NavLink to='/upload'><button disabled>FileUpload</button></NavLink> : <NavLink to='/upload'><button>FileUpload</button></NavLink>}
                    {loader ? <NavLink to='/Logout'><button disabled>Logout</button></NavLink> : <NavLink to='/Logout'><button>Logout</button></NavLink>}
                </>
            ) : (
                <>
                    <NavLink to='/'><button>Home</button></NavLink>                    
                    <NavLink to='/registerpage'><button>Sign Up</button></NavLink>
                    <NavLink to='/loginpage'><button>Sign In</button></NavLink>
                </>
            )
            }
    </div>
)
}
export default Navbar
