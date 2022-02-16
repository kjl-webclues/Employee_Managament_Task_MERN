import React from 'react'
import { NavLink } from 'react-router-dom';
import { useSelector } from "react-redux"


const Navbar = () => {  
    
    const loginStatus = useSelector(state => state.loginStatus)
    
    return (
    <div className='nav-div'>
    {
            loginStatus === true ? (
                <>
                    <NavLink to='/upload'><button>FileUpload</button></NavLink>
                    <NavLink to='/Logout'><button>Logout</button></NavLink>
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
