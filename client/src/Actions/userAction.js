import axios from "axios";

//////////////////////////////////// USER ACTIONS START ////////////////////////////////////
///////////////////////// For Register user /////////////////////////
export const register_user = (values) => dispatch => {
    return (
       axios.post(`/signUp`, values)
            .then(() => {
                dispatch({ type: "REGISTER_USER", payload: values })
                alert("Registration Successful");                    
            })
            .catch(error => {
                alert("Invalid Registration")
                console.log('error', error);
            })        
    )

}

///////////////////////// For Login User /////////////////////////
export const login_User = (values) => dispatch => {
    return (
        axios.post(`/signIn`, values)
            .then((res) => {                
                alert("Login Successful");
                dispatch({ type: "LOGIN_USER", payload: res.data })
            })
            .catch(error => {
                alert("Invalid Credentials")
                console.log('error', error);
            })
    )
}

///////////////////////// For Get Request /////////////////////////
export const get_User = (page,Request) => dispatch => {
    return (
        axios.get(`/getUser/${page}/${Request}`)
            .then(res => {
                const getUserData = res.data;
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
export const update_User = (id, values) => dispatch => {
    return (
        axios.put(`/updateUser/${id}`, values)
            .then(res => {
                const updateUserData = res.data;
                dispatch({ type: "UPDATE_USER", payload: updateUserData })
            })
            .catch(error => {
                console.log("error", error);
            })
    )
}

///////////////////////// For Delete User /////////////////////////
export const delete_User = (id) => dispatch => {
    return (
        axios.delete(`/deleteUser/${id}`)
        .then(res => {
                const userData = res.data;
                dispatch({ type: "DELETE_USER", payload: userData })
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

///////////////////////// For State DropdownList /////////////////////////
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

///////////////////////// For City DropdownList /////////////////////////
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
