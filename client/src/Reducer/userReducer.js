const initialState = {
    userData: [],
    loginStatus: false,
    // userList: [],
    countryData: [],
    stateData: [],
    cityData: [],
    pageNumber:[]
}

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case "REGISTER_USER":
            return {
                ...state
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
                pageNumber:action.payload.totalPage,
            }
        
        case "EDIT_USER":
            return {
                ...state,
                // userList: action.payload
            }
        
        case "UPDATE_USER":
            return {
                ...state
            }
        
        case "DELETE_USER":
            return {
                ...state
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

