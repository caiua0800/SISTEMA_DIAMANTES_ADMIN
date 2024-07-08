// assets.js
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebaseConfig';


// Função para adicionar uma semana a uma data
export function addWeekToDateString(dateString) {
    const [day, month, year] = dateString.split('/').map(Number);
    const date = new Date(year, month - 1, day);
    date.setDate(date.getDate() + 7);
    const newDay = String(date.getDate()).padStart(2, '0');
    const newMonth = String(date.getMonth() + 1).padStart(2, '0');
    const newYear = date.getFullYear();
    return `${newDay}/${newMonth}/${newYear}`;
}

// Função para formatar um número no formato brasileiro
export const formatNumber = (value) => {
    if (typeof value !== 'number' || isNaN(value)) {
        return '0.00'; // Valor padrão caso o valor seja indefinido ou não seja um número
    }
    return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};



export const formatCPF = (cpf) => {
    cpf = cpf.replace(/\D/g, '');
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

export const getClients = async (setUsers) => {
    try {
        const querySnapshot = await getDocs(collection(db, 'USERS'));
        let userList = [];

        querySnapshot.forEach((doc) => {
            const userData = doc.data();
            let totalPago = 0;
            let totalCoins = 0;
            let totalLucro = 0;

            // Verifica se existe o campo CONTRATOS e se é um array
            if (userData.CONTRATOS && Array.isArray(userData.CONTRATOS)) {
                userData.CONTRATOS.forEach((contrato) => {
                    // Verifica se STATUS é true antes de adicionar ao totalPago
                    if (contrato.STATUS) {
                        totalPago += contrato.TOTALSPENT || 0;
                        totalCoins += contrato.COINS || 0;
                        totalLucro += ((contrato.LUCRO_OBTIDO / 100) * contrato.TOTALSPENT);
                    }
                });
            }

            const user = {
                ID: doc.id,
                NAME: userData.NAME,
                CPF: formatCPF(userData.CPF),
                CONTACT: userData.CONTACT,
                EMAIL: userData.EMAIL,
                TOTALPAGO: totalPago,
                TOTALCOINS: totalCoins,
                DOCSENVIADOS: userData.DOCSENVIADOS,
                VERIFICADO: userData.VERIFICADO,
                DOCURL: userData.DOCCLIENT,
                FACEURL: userData.FACECLIENT,
                COIN_VALUE_ATUAL: userData.COIN_VALUE_ATUAL,
                LUCRO_OBTIDO: totalLucro,
            };

            userList.push(user);
        });

        setUsers(userList);
    } catch (error) {
        console.error("Error getting users:", error);
    }
};