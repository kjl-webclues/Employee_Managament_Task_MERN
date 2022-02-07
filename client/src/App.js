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
import { useSelector } from "react-redux"
import 'bootstrap/dist/css/bootstrap.min.css'


const App = () => {

  const loginStatus = useSelector(state => state.loginStatus)
  console.log(loginStatus);
  
  return (
     <>      
        <Navbar />                        
          <Switch>
            <Route exact path='/' component={Home}></Route>  
            <Route exact path='/registerpage' component={RegForm}></Route>        
            <Route exact path='/editUser/:id' component={RegForm}></Route>
        
            <ProtectedRoute exact path='/dashbord' component={Dashbord} isAuth={loginStatus} ></ProtectedRoute>
            <ProtectedRoute exact path='/Logout' component={Logout} isAuth={loginStatus}></ProtectedRoute>
            {!loginStatus ?
                <Route exact path='/loginpage' component={LoginForm} isAuth={loginStatus} />
                  : <Redirect to = '/dashbord'/> }
                <Route component={Error404} />          
          </Switch>      
    </>
  );
};
export default App