import {LOGIN_SUCCESS } from  '../action';

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
        default: 
            return state
    }
}

export default user;