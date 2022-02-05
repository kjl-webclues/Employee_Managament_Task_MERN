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
    registerToggle: false
}

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case "REGISTER_USER":
            return {
                ...state,
                registerToggle: true
            }
        
        case "REGISTER_TOGGLE":
            return {
                ...state,
                registerToggle: false
            }
        
        case "LOGIN_USER":
            return {
                ...state,
                loginStatus: true
            }
        
        case "GET_USER":
            return {
                ...state,
                userData: action.payload.users,
                pageNumber: action.payload.totalPage,
                LoginUser: action.payload.LoginUser,
                emailExist: false
            }
        
        case "EDIT_USER":
            return {
                ...state
            }
        
        case "UPDATE_USER":
            return {
                ...state,
                emailExist: true
            }
        
        case "DELETE_USER":
            console.log("delete", action.payload);
            return {
                ...state,
                loginStatus: action.payload,
                DeleteUser: true,
            }
        
        case "LOGOUT_USER":
            return {
                ...state,
                loginStatus: false
            }
        case "COUNTRY":
            return {
                ...state,
                countryData: action.payload
            }
        case "STATE":
            return {
                ...state,
                stateData: action.payload
            }
        case "CITY":
            return {
                ...state,
                cityData: action.payload
            }        
        default:
            return state
    }
}

export default userReducer;

