import { combineReducers } from 'redux';

import userReducer from './user/reducer';
import DepositosReducer from './Depositos/reducer';

const rootReducer = combineReducers({userReducer, DepositosReducer});

export default rootReducer;