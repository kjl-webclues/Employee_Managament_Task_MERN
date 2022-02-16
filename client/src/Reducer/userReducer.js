import { CHECK_COOKIE, CITY, COUNTRY, DELETE_MULTIPLE_FILE, DELETE_UPLODED_FILE, DELETE_USER, EDIT_USER, GET_UPLOAD_FILES, GET_USER, LOGIN_USER, LOGOUT_USER, REGISTER_TOGGLE, REGISTER_USER, SET_LOADER, STATE, UPDATE_USER, UPLOAD_FILES } from "../Actions/actionType"

const initialState = {
    userData: [],
    loginStatus: false,
    countryData: [],
    stateData: [],
    cityData: [],
    pageNumber: [],
    LoginUser: '',
    DeleteUser: false,
    emailExist: false,
    registerToggle: false,
    uploadFile: [],
    loader: true,
    FilePage: [],
    // multipleDeleteToggle: false
    
}

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case REGISTER_USER:
            return {
                ...state,
                registerToggle: true
            }
        
        case REGISTER_TOGGLE:
            return {
                ...state,
                registerToggle: false
            }
        
        case LOGIN_USER:
            return {
                ...state,
                loginStatus: true
            }
        
        case GET_USER:
            return {
                ...state,
                loginStatus: true,
                userData: action.payload.users,
                pageNumber: action.payload.totalPage,
                LoginUser: action.payload.LoginUser,
                emailExist: false
            }
        
        case EDIT_USER:
            return {
                ...state
            }
        
        case UPDATE_USER:
            return {
                ...state,
                emailExist: true
            }
        
        case DELETE_USER:
            return {
                ...state,
                loginStatus: action.payload,
                DeleteUser: true,
            }
        
        case LOGOUT_USER:
            return {
                ...state,
                loginStatus: false
            }
        
        case COUNTRY:
            return {
                ...state,
                countryData: action.payload
            }
        
        case STATE:
            return {
                ...state,
                stateData: action.payload
            }
        
        case CITY:
            return {
                ...state,
                cityData: action.payload
            }
        
        case UPLOAD_FILES:
            return {
                ...state,
                loader: false
            }
        
        case GET_UPLOAD_FILES: 
            return {
                ...state,
                uploadFile: action.payload.files,
                FilePage: action.payload.totalPage,
                DeleteUser: false,
                LoginUser: action.payload.LoginUser
            }   
            
        case DELETE_UPLODED_FILE: 
            return {
                ...state,
                DeleteUser: true,
                // loader:false
            }
        
        case DELETE_MULTIPLE_FILE:
            return {
                ...state,
                DeleteUser: true,
                // loader:false
            }
        
        case CHECK_COOKIE: 
            return {
                ...state,
                loginStatus: action.payload.loginStatus
            }        
        
        case SET_LOADER:
            return {
                ...state,
                loader: true
        }
        
        default:
            return state
    }
}

export default userReducer;

