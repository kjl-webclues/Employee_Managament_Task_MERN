import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Navbar from './Component/Navbar'
import Home from './Component/Home'
import RegForm from './Component/RagisterForm'
import LoginForm from './Component/LoginForm'
import Dashbord from './Component/Dashbord'
import Logout from './Component/Logout'
import ProtectedRoute from './Component/ProtectedRoute'
import { useSelector } from "react-redux"
import 'bootstrap/dist/css/bootstrap.min.css'


const App = () => {

  const userState = useSelector(state => state.userState)
  console.log(userState);
  
  return (
     <>      
        <Navbar />                        
          <Switch>
            <Route exact path='/' component={Home}></Route>  
            <Route exact path='/registerpage' component={RegForm}></Route>        
            <Route exact path='/editUser/:id' component={RegForm}></Route>            
            <ProtectedRoute exact path='/loginpage' component={LoginForm} isAuth={!userState}></ProtectedRoute>
            <ProtectedRoute exact path='/dashbord' component={Dashbord} isAuth={userState} ></ProtectedRoute>
            <ProtectedRoute exact path='/Logout' component={Logout} isAuth={userState}></ProtectedRoute>
        </Switch>      
    </>
  );
};
export default App