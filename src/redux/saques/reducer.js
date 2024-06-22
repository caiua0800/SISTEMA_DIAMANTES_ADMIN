import SaquesActionTypes from './action-types';

const initialState = {
    saques: [],
};

const SaquesReducer = (state = initialState, action) => {
    switch (action.type) {
        case SaquesActionTypes.GET:
            return {
                ...state,
                saques: action.payload,
            };
        case SaquesActionTypes.UPDATE:
            return {
                ...state,
                saques: state.saques.map(user => {
                    if (user.ID === action.payload.userId) {
                        return {
                            ...user,
                            SAQUES: action.payload.updatedSaques,
                        };
                    }
                    return user;
                }),
            };
        default:
            return state;
    }
};

export default SaquesReducer;
