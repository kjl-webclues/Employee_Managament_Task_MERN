import axios from "axios";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { DELETE_USER } from "./actionType";
toast.configure()

//////////////////////////////////// USER ACTIONS START ////////////////////////////////////
///////////////////////// For Register user /////////////////////////
export const register_user = (values) => dispatch => {
    return (
       axios.post(`/signUp`, values)
            .then((res) => {
                dispatch({ type: "REGISTER_USER", payload: values })
                const result = res.data
                console.log(result);
                if (result === "Email already Exists") {
                toast.error(result, { position: toast.POSITION.TOP_LEFT, autoClose:2000 })
                } else {
                toast.success(result, { position: toast.POSITION.TOP_LEFT, autoClose:2000 });
                }
            })
            .catch(error => {
                console.log('error', error);
            })
    )

}

export const register_Toggle = () => dispatch => {
    return (
        dispatch({type:"REGISTER_TOGGLE"})
    )
}

///////////////////////// For Login User /////////////////////////
export const login_User = (values) => dispatch => {
    return (
        axios.post(`/signIn`, values)
            .then((res) => {                
                toast.success("Login Successful", { position: toast.POSITION.TOP_LEFT, autoClose:2000 });
                dispatch({ type: "LOGIN_USER" })
            })
            .catch(error => {
                toast.error("Invalid Credentials", { position: toast.POSITION.TOP_LEFT, autoClose:2000 })
                console.log('error', error);
            })
    )
}

///////////////////////// For Get Request /////////////////////////
export const get_User = (page,sort,Request) => dispatch => {
    return (
        axios.get(`/getUser/?page=${page}&sort=${sort}&Request=${Request}`)
            .then(res => {
                const getUserData = res.data;
                //console.table(getUserData)
                dispatch({ type: "GET_USER" , payload: getUserData })            
            })
            .catch(error => {
                console.log("error", error);            
            })
    )
}

///////////////////////// For Edit User /////////////////////////
export const edit_User = (id) => dispatch => {
    return (
        axios.get(`/editUser/${id}`)
            .then(res => {
                const editUserData = res.data;
                dispatch({type: "EDIT_USER", payload:editUserData})
            })
                .catch(error => {
                console.log("error", error);
            })
    )
}

///////////////////////// For Update User /////////////////////////
export const update_User = (id, values, email) => dispatch => {
    return (
        axios.put(`/updateUser/${id}/${email}`, values)
            .then(res => {
                toast.success("Employee Updated Successfully!", { position: toast.POSITION.TOP_LEFT, autoClose:2000 });
                
                dispatch({ type: "UPDATE_USER" })
            })
            .catch(error => {
                toast.error("Email already in use", { position: toast.POSITION.TOP_LEFT, autoClose:2000 });
                console.log("error", error);
            })
    )
}

///////////////////////// For Delete User /////////////////////////
export const delete_User = (id) => dispatch => {
    return (
        axios.delete(`/deleteUser/${id}`)
            .then(res => {
                toast.success("Delete Record Successfully", { position: toast.POSITION.TOP_LEFT, autoClose: 2000 });                             
                const userData = res.data;
                dispatch({ type: DELETE_USER, payload: userData })
            })
            .catch(error => {
                console.log("error", error);
            })
    )
}

///////////////////////// For Logout User /////////////////////////
export const logout_User = () => dispatch => {
    return (
        axios.get(`/logout`)
        .then(res => {
                const userData = res.data;
                dispatch({ type: "LOGOUT_USER", payload: userData })
            })
            .catch(error => {
                console.log("error", error);
            })
    )
}

///////////////////////// For Country DropdownList /////////////////////////
export const country = () => dispatch => {
    axios.get(`/getCountry`)
        .then(res => {
                const userData = res.data;
                dispatch({ type: "COUNTRY", payload: userData })
            })
            .catch(error => {
                console.log("error", error);
            })
}

// ///////////////////////// For State DropdownList /////////////////////////
export const state = (countryId) => dispatch => {
    axios.get(`/getState/${countryId}`)
        .then(res => {
            const userData = res.data;
                dispatch({ type: "STATE", payload: userData })
            })
            .catch(error => {
                console.log("error", error);
            })
}

// ///////////////////////// For City DropdownList /////////////////////////
export const city = (stateId) => dispatch => {
    axios.get(`/getCity/${stateId}`)
        .then(res => {
            const userData = res.data;
                dispatch({ type: "CITY", payload: userData })
            })
            .catch(error => {
                console.log("error", error);
            })
}

//////////////////////////////////// USER ACTIONS END ////////////////////////////////////

