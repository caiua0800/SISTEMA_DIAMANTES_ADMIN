import { combineReducers } from 'redux';

import userReducer from './user/reducer';
import DepositosReducer from './Depositos/reducer';
import SaquesReducer from './saques/reducer';

const rootReducer = combineReducers({
    userReducer,
    DepositosReducer,
    SaquesReducer
});

export default rootReducer;
