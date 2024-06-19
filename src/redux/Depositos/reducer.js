import DepositosActionTypes from './action-types';

const initialState = {
    depositos: [],
};

const DepositosReducer = (state = initialState, action) => {
    switch (action.type) {
        case DepositosActionTypes.GET:
            return {
                ...state,
                depositos: action.payload,
            };
        case DepositosActionTypes.UPDATE:
            return {
                ...state,
                depositos: state.depositos.map(user => {
                    if (user.ID === action.payload.userId) {
                        return {
                            ...user,
                            CONTRATOS: action.payload.updatedContratos,
                        };
                    }
                    return user;
                }),
            };
        default:
            return state;
    }
};

export default DepositosReducer;
