// reducer.js

import userActionTypes from './action-types';

const initialState = {
    currentUser: null,
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case userActionTypes.LOGIN:
            localStorage.setItem('user', JSON.stringify(action.payload));
            return { ...state, currentUser: action.payload };

        case userActionTypes.LOGOUT:
            localStorage.removeItem('user');
            return { ...state, currentUser: null }; 

        default:
            return state;
    }
};

export default userReducer;
