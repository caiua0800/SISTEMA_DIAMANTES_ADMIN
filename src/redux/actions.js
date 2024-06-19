import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { collection, query, where, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../DATABASE/firebaseConfig';
import userActionTypes from './user/action-types';
import DepositosActionTypes from './Depositos/action-types';

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
                payload: { EMAIL: email, CPF: cpf, PASS: password }
            });
        } catch (error) {
            console.error("Error signing in with email and password", error);
        }
    };
};

export const logoutUser = () => {
    return async (dispatch) => {
        const auth = getAuth();
        try {
            await signOut(auth);
            dispatch({
                type: userActionTypes.LOGOUT,
                payload: null 
            });
            localStorage.removeItem('user'); 
            localStorage.removeItem('cpf');

            window.location.href = '/';
        } catch (error) {
            console.error("Error signing out", error);
        }
    };
};

export const getDepositos = () => {
    return async (dispatch) => {
        try {
            console.log('o')
            const usersCollection = collection(db, 'USERS');
            const querySnapshot = await getDocs(usersCollection);

            let depositos = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                if (data.CONTRATOS) {
                    const contratosComInfoAdicional = data.CONTRATOS.map(contrato => ({
                        ...contrato,
                        NAME: data.NAME,
                        CONTACT: data.CONTACT,
                        ID: doc.id,
                    }));
                    depositos = [...depositos, ...contratosComInfoAdicional];
                }
            });

            dispatch({
                type: DepositosActionTypes.GET,
                payload: depositos
            });
        } catch (error) {
            console.error('Erro ao obter dados dos depósitos:', error);
        }
    };
};

export const setAceito = (userId, contratoId, aceito) => {
    return async (dispatch) => {
        try {
            const userDocRef = doc(db, 'USERS', userId); // Obtém a referência para o documento USERS

            const userDocSnapshot = await getDoc(userDocRef); // Obtém o snapshot do documento

            if (!userDocSnapshot.exists()) {
                console.error(`User document with ID ${userId} does not exist.`);
                return;
            }

            const userData = userDocSnapshot.data(); // Obtém os dados do documento

            if (!userData.CONTRATOS || userData.CONTRATOS.length === 0) {
                console.error(`User document with ID ${userId} has no contracts.`);
                return;
            }

            // Atualiza o array CONTRATOS para refletir o novo status
            const updatedContratos = userData.CONTRATOS.map(contrato => {
                if (contrato.IDCOMPRA === contratoId) {
                    return { ...contrato, STATUS: aceito };
                }
                return contrato;
            });

            // Atualiza o documento no Firestore com os novos dados
            await updateDoc(userDocRef, { CONTRATOS: updatedContratos });

            // Dispara uma ação Redux para indicar que o status foi atualizado com sucesso
            dispatch({
                type: DepositosActionTypes.UPDATE,
                payload: { userId, updatedContratos }
            });

        } catch (error) {
            console.error('Error updating contrato status:', error);
        }
    };
};