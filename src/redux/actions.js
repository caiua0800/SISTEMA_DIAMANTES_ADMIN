import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { collection, query, where, getDocs, getDoc, doc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../DATABASE/firebaseConfig';
import userActionTypes from './user/action-types';
import DepositosActionTypes from './Depositos/action-types';
import SaquesActionTypes from './saques/action-types'; // Verifique o caminho correto para o seu arquivo de actionTypes



export const loginUser = (email, password, setLoad) => {
    return async (dispatch) => {
        const auth = getAuth();
        try {
            setLoad(true)
            // Verifica na coleção ADMIN se o email existe
            const adminQuery = query(collection(db, 'ADMIN'), where('EMAIL', '==', email),
                where('ALLOW', '==', true));
            const adminQuerySnapshot = await getDocs(adminQuery);
            let cpf = '';

            adminQuerySnapshot.forEach((doc) => {

                if (doc.exists) {
                    cpf = doc.id;
                }
            });

            if (cpf) {
                console.log('login salvo')
                await signInWithEmailAndPassword(auth, email, password);
                dispatch({
                    type: userActionTypes.LOGIN,
                    payload: { EMAIL: email, CPF: cpf, PASS: password }
                });
                setLoad(false)

            } else {
                alert('Usuário não encontrado na coleção ADMIN');
                setLoad(false)
                // Aqui você pode adicionar um dispatch para um tipo de erro
            }
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            // Aqui você pode adicionar um dispatch para um tipo de erro
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

export const getTotalValorSacado = async () => {
    try {
        // Referência à coleção 'USERS'
        const usersCollectionRef = collection(db, 'USERS');

        // Obter todos os documentos da coleção 'USERS'
        const querySnapshot = await getDocs(usersCollectionRef);

        // Inicializar a variável para armazenar a soma dos valores
        let totalValorSacado = 0;

        // Iterar sobre cada documento e somar o valor do campo 'VALORSACADO'
        querySnapshot.forEach((doc) => {
            const userData = doc.data();
            if (userData.VALORSACADO) {
                totalValorSacado += userData.VALORSACADO;
            }
        });

        // Retornar a soma total
        return totalValorSacado;
    } catch (error) {
        console.error('Erro ao obter o valor total sacado:', error);
        throw error;
    }
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
                        VALORSACADO: data.VALORSACADO,
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

export const getSaques = () => {
    return async (dispatch) => {
        try {
            const usersCollection = collection(db, 'USERS');
            const querySnapshot = await getDocs(usersCollection);
            let saques = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                if (data.SAQUES) {
                    const saquesComInfoAdicional = data.SAQUES.map(contrato => ({
                        ...contrato,
                        NAME: data.NAME,
                        CONTACT: data.CONTACT,
                        ID: doc.id,
                    }));
                    saques = [...saques, ...saquesComInfoAdicional];
                }
            });
            dispatch({
                type: SaquesActionTypes.GET,
                payload: saques
            });
        } catch (error) {
            console.error('Erro ao obter dados dos saques:', error);
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
                    return { ...contrato, STATUS: aceito, VISTO: true };
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

function convertStringToNumber(str) {
    // Remove os pontos
    const withoutDots = str.replace(/\./g, '');
    // Substitui a vírgula por um ponto
    const withDot = withoutDots.replace(',', '.');
    // Converte a string para um número
    return parseFloat(withDot);
}

// actions.js
export const setAceitoSaques = (userId, saqueId, aceito, methodPayment, obs, valor) => {
    return async (dispatch) => {
        try {
            const userDocRef = doc(db, 'USERS', userId);
            const userDocSnapshot = await getDoc(userDocRef);

            if (!userDocSnapshot.exists()) {
                console.error(`User document with ID ${userId} does not exist.`);
                return;
            }

            const userData = userDocSnapshot.data();

            if (!userData.SAQUES || userData.SAQUES.length === 0) {
                console.error(`User document with ID ${userId} has no saques.`);
                return;
            }

            if (!userData.COIN_VALUE_ATUAL) {
                console.error(`User document with ID ${userId} does not have COIN_VALUE_ATUAL.`);
                return;
            }

            const valor_moeda_atual_do_cliente = parseFloat(userData.COIN_VALUE_ATUAL);
            const valor_sacado = userData.VALORSACADO ? (userData.VALORSACADO) : 0;


            let gotCoinsTransation = 0;

            const updatedSaques = userData.SAQUES.map(saque => {

                if (saque.IDSAQUE === saqueId) {
                    const today = new Date();
                    const dia = String(today.getDate()).padStart(2, '0'); // Adiciona zero à esquerda se for necessário
                    const mes = String(today.getMonth() + 1).padStart(2, '0'); // Adiciona zero à esquerda se for necessário
                    const ano = today.getFullYear();
                    const dataFormatada = `${dia}/${mes}/${ano}`;
                    gotCoinsTransation = (parseFloat(saque.VALOR.replace('.', '').replace(',', '.')) / valor_moeda_atual_do_cliente)
                    return { ...saque, APROVADO: aceito, PENDENTE: true, DATARECEBIMENTO: dataFormatada, DADOSRECEBIMENTO: methodPayment, OBS: obs }; // Define PENDENTE como true
                }
                return saque;
            });

            const currentGotCoins = parseFloat(userData.GOTCOINS || '0');
            const updatedGotCoins = (currentGotCoins + gotCoinsTransation).toFixed(2);

            if (aceito) {
                await updateDoc(userDocRef, { SAQUES: updatedSaques, GOTCOINS: updatedGotCoins.toString(), VALORSACADO: (valor_sacado + convertStringToNumber(valor)) });
            }else{
                await updateDoc(userDocRef, { SAQUES: updatedSaques });
            }

            dispatch({
                type: SaquesActionTypes.UPDATE,
                payload: { userId, updatedSaques }
            });

        } catch (error) {
            console.error('Error updating saques status:', error);
        }
    };
};


export const toggleAllowAdminUser = (docId) => {
    return async (dispatch) => {
        try {
            const adminDocRef = doc(db, 'ADMIN', docId); // Obtém a referência para o documento na coleção ADMIN

            const adminDocSnapshot = await getDoc(adminDocRef); // Obtém o snapshot do documento

            if (!adminDocSnapshot.exists()) {
                console.error(`Admin document with ID ${docId} does not exist.`);
                return;
            }

            const adminData = adminDocSnapshot.data(); // Obtém os dados do documento
            const currentAllow = adminData.ALLOW; // Obtém o valor atual de ALLOW

            // Inverte o valor de ALLOW
            const updatedAllow = !currentAllow;

            // Atualiza o documento no Firestore com o novo valor de ALLOW
            await updateDoc(adminDocRef, { ALLOW: updatedAllow });

            // Opcional: Dispara uma ação Redux para indicar que o ALLOW foi atualizado com sucesso
            dispatch({
                type: userActionTypes.SETAUTH, // Defina seu tipo de ação conforme necessário
                payload: { docId, updatedAllow }
            });

        } catch (error) {
            console.error('Error updating ALLOW:', error);
        }
    };
};

export const createUser = (name, cpf, email, contact, cargo, password) => {
    return async (dispatch) => {
        const auth = getAuth();
        try {
            // Cria o usuário no Firebase Authentication
            await createUserWithEmailAndPassword(auth, email, password);

            // Cria o documento na coleção ADMIN com o doc.id sendo o CPF
            await setDoc(doc(db, 'ADMIN', cpf), {
                NAME: name,
                CPF: cpf,
                EMAIL: email,
                CONTACT: contact,
                CARGO: cargo,
                ALLOW: false
            });

            dispatch({
                type: userActionTypes.CREATE,
                payload: { NAME: name, CPF: cpf, EMAIL: email, CONTACT: contact, CARGO: cargo, ALLOW: false }
            });

        } catch (error) {
            console.error('Error creating user:', error);
            // Você pode adicionar tratamentos de erro adicionais aqui conforme necessário
        }
    };
};

export const consultarALLOWSELL = (dateString) => {
    // Split the input date string to get day, month, and year
    const [day, month, year] = dateString.split('/').map(Number);
    
    // Create a Date object for the input date
    const inputDate = new Date(year, month - 1, day); // Note: months are 0-indexed in JS Date
    
    // Get the current date
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set hours to 0 to compare only the date part

    // Compare dates
    return today < inputDate;
}

