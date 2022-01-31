const initialState = {
    userData: [],
    userState: true,
    userList: [],
    countryData: [],
    stateData: [],
    cityData: [],
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
                userData: [action.payload],
                userState: true
            }
        
        case "GET_USER":
            return {
                ...state,
                userData: action.payload
            }
        
        case "EDIT_USER":
            return {
                ...state,
                userList: action.payload
            }
        
        case "UPDATE_USER":
            return {
                ...state,                
                userList: action.payload
            }
        
        case "DELETE_USER":
            return {
                ...state,
                userState: false
            }
        
        case "LOGOUT_USER":
            return {
                ...state,
                userState: false
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

