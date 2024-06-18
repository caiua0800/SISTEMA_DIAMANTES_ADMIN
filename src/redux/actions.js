import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../DATABASE/firebaseConfig';
import userActionTypes from './user/action-types';

export const loginUser = (email, password) => {
    return async (dispatch) => {
        const auth = getAuth();
        try {

            await signInWithEmailAndPassword(auth, email, password);
            const q = query(collection(db, 'USERS'), where('EMAIL', '==', email));
            const querySnapshot = await getDocs(q);
            let cpf = '';
            querySnapshot.forEach((doc) => {
                if (doc.exists) {
                    cpf = doc.data().CPF;
                }
            });
            dispatch({
                type: userActionTypes.LOGIN,
                payload: { EMAIL: email, CPF: cpf }
            });
        } catch (error) {
            console.error("Error signing in with email and password", error);
        }
    };
};
