import userActionTypes from './action-types';

const initialState = {
    currentUser: null,
    isAuthenticated: false,
    users: [], // Adiciona um estado para armazenar os usuários
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case userActionTypes.LOGIN:
            localStorage.setItem('user', JSON.stringify(action.payload));
            return { ...state, currentUser: action.payload, isAuthenticated: true };

        case userActionTypes.LOGOUT:
            localStorage.removeItem('user');
            return { ...state, currentUser: null, isAuthenticated: false }; 

        case userActionTypes.SETAUTH:
            return {
                ...state,
                isAuthenticated: action.payload.isAuthenticated,
            };
        
        case userActionTypes.CREATE:
            return {
                ...state,
                users: [...state.users, action.payload],
            };

        default:
            return state;
    }
};

export default userReducer;
