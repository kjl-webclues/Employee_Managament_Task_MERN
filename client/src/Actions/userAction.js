import axios from "axios";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { CHECK_COOKIE, DELETE_MULTIPLE_FILE, DELETE_UPLODED_FILE, DELETE_USER, GET_UPLOAD_FILES, SET_LOADER, UPLOAD_FILES } from "./actionType";
toast.configure()

//////////////////////////////////// USER ACTIONS START ////////////////////////////////////

///////////////////////// For Register user /////////////////////////
export const register_user = (values) => dispatch => {
    return (
       axios.post(`/signUp`, values)
            .then((res) => {
                const result = res.data
                console.log(result);
                if (result === "Email already Exists") {
                toast.error(result, { position: toast.POSITION.TOP_LEFT, autoClose:2000 })
                } else {
                    toast.success(result, { position: toast.POSITION.TOP_LEFT, autoClose: 2000 });
                    dispatch({ type: "REGISTER_USER", payload: values })                    
                }
            })
            .catch(error => {
                console.log('error', error);
            })
    )

}

//////////////////////// Register Toggle Action /////////////////////////
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
                console.table(getUserData)
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

// ///////////////////////// For Upload UserFile ////////////////////////////
export const upload_Files = (file) => dispatch => {
    axios.post('/uploadFile',file)
        .then((res) => {
            if (res.data.length === 0) {
                const msg = res.data.msg
                toast.success(msg, { position: toast.POSITION.TOP_LEFT, autoClose: 2000 });
            } else {
                toast.error(`${res.data} ${res.data.length} Files Not Uploded`, {position: toast.POSITION.TOP_CENTER, autoClose: 2000})
            }            
            dispatch({type: UPLOAD_FILES, payload: res.data})
            })
        .catch(error => {
            dispatch({type: UPLOAD_FILES})                
            toast.error("File Not Supported", { position: toast.POSITION.TOP_LEFT, autoClose:2000 });            
            })
}

// ///////////////////////// For Get UploadFileList ////////////////////////////
export const get_UploadFile = (page) => dispatch => {
    axios.get(`/getListFile/?page=${page}`)
        .then((res) => {
            const userData = res.data
            dispatch({ type: GET_UPLOAD_FILES, payload: userData })
        })
        .catch(error => {
            console.log('error', error);
        })
}

// ///////////////////////// For Delete SingleFile ////////////////////////////
export const delete_UploadFile = (id) => dispatch => {
    axios.delete(`/deleteFile/?id=${id}`)
        .then(() => {
            toast.success("File Deleted Successfully", { position: toast.POSITION.TOP_LEFT, autoClose: 2000 });            
            dispatch({type: DELETE_UPLODED_FILE })
        })
        .catch(error => {
            toast.error("File not Deleted", { position: toast.POSITION.TOP_LEFT, autoClose: 2000 });            
            console.log('error', error);
        })
}

// ///////////////////////// For Delete MultipleFile ////////////////////////////
export const delete_MultipleFile = (file) => dispatch => {
    axios.put(`/deleteMultipleFile`, file)
        .then(() => {
            toast.success("File Deleted Successfully", { position: toast.POSITION.TOP_LEFT, autoClose: 2000 });
            dispatch({type: DELETE_MULTIPLE_FILE})
        })
        .catch(error => {
            dispatch({type: DELETE_MULTIPLE_FILE})
            toast.error("Files not Deleted", { position: toast.POSITION.TOP_LEFT, autoClose: 2000 });            
            console.log('error', error);
        })
}

/////////////////////////// For Check Cookie ///////////////////////////////////////
export const checkCookie = () => dispatch => {
    axios.get(`/checkCookie`)
        .then(res => {
            const userData = res.data
            dispatch({type: CHECK_COOKIE, payload: userData})
        })
        .catch(error => {
            console.log('error', error)
        })
}

/////////////////////////// For Set Loader ////////////////////////////
export const set_Loader = () => dispatch => {
    dispatch({type: SET_LOADER})
}


//////////////////////////////////// USER ACTIONS END ////////////////////////////////////

