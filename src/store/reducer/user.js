import { LOGIN_SUCCESS, LOGOUT_SUCCESS } from  '../action';

const initialState= {
    user: null
}

const user =(state=initialState, action) => {
    switch(action.type) {
        case LOGIN_SUCCESS:
            return {
                ...state,
                user: action.user 
            }
        case LOGOUT_SUCCESS:
            return {
                ...state,
                user: null
            }
        default: 
            return state
    }
}

export default user;