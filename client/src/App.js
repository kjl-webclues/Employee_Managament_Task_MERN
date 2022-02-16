import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import Navbar from './Component/Navbar'
import Home from './Component/Home'
import RegForm from './Component/RagisterForm'
import LoginForm from './Component/LoginForm'
import Dashbord from './Component/Dashbord'
import Error404 from './Component/Error'
import Logout from './Component/Logout'
import ProtectedRoute from './Component/ProtectedRoute'
import { useDispatch, useSelector } from "react-redux"
import 'bootstrap/dist/css/bootstrap.min.css'
import FileUpload from './Component/FileUpload'
// import { useEffect } from 'react'
// import { checkCookie } from './Actions/userAction'
import Cookies from 'js-cookie'

const App = () => {

  const loginStatus = useSelector(state => state.loginStatus)

  const cookie = Cookies.get('jwtLogin')

  // const dispatch = useDispatch()

  // useEffect(() => {
  //   dispatch(checkCookie())
  // }, [dispatch])
  
  return (
     <>      
        <Navbar />                        
          <Switch>
            <Route exact path='/' component={Home}></Route>  
            <Route exact path='/registerpage' component={RegForm}></Route>        
            <Route exact path='/editUser/:id' component={RegForm}></Route>
        
            <ProtectedRoute exact path='/upload' component={FileUpload} isAuth={cookie} ></ProtectedRoute>
            <ProtectedRoute exact path='/dashbord' component={Dashbord} isAuth={cookie} ></ProtectedRoute>
            <ProtectedRoute exact path='/Logout' component={Logout} isAuth={cookie}></ProtectedRoute>

            { loginStatus === false ?
                <Route exact path='/loginpage' component={LoginForm}/>
                  : <Redirect to = '/dashbord'/> }
                <Route component={Error404} />          
          </Switch>      
    </>
  );
};
export default App