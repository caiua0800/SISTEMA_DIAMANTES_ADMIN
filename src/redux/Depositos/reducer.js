// reducer.js

import DepositosActionTypes from "./action-types";

const initialState = {
    currentUser: false,
};

const DepositosReducer = (state = initialState, action) => {
    switch (action.type) {
        case DepositosActionTypes.GET:


        default:
            return state;
    }
};

export default DepositosReducer;
