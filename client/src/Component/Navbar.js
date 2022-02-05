import React from 'react'
import { NavLink } from 'react-router-dom';
import { useSelector } from "react-redux"


const Navbar = () => {  
    
  const loginStatus = useSelector(state => state.loginStatus)

    const RenderMenu = () => { 

        if (loginStatus) {
            return (
                <>
                    {/* <NavLink to='/'><button>Home</button></NavLink> */}
                    {/* <NavLink to='/registerpage'><button>Sign Up</button></NavLink>*/}
                    {/* <NavLink to='/dashbord'><button>Dashbord</button></NavLink> */}
                    <NavLink to='/Logout'><button>Logout</button></NavLink>
                </>
            )
        } else {
            return (
                <>
                    <NavLink to='/'><button>Home</button></NavLink>                    
                    <NavLink to='/registerpage'><button>Sign Up</button></NavLink>
                    <NavLink to='/loginpage'><button>Sign In</button></NavLink>
                    {/* <NavLink to='/dashbord'><button>Dashbord</button></NavLink>*/}
                </>
            )
        }
    }

    return (
        <>
            <div className='nav-div'>                                
                <RenderMenu />
            </div>
        </>
    )
}

export default Navbar
