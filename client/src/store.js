import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk"
import userReducer from "./Reducer/userReducer";

const store = createStore(
    userReducer,
    compose(applyMiddleware(thunk), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() || compose));

export default store

