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
export const formatNumber = (number) => {
    return number.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
};


export const formatCPF = (cpf) => {
    cpf = cpf.replace(/\D/g, '');
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

export const getUsers = async (setUsers) => {
    try {
        const querySnapshot = await getDocs(collection(db, 'USERS'));
        let userList = [];
        querySnapshot.forEach((doc) => {
            // Para cada documento, extrair os campos NAME, CPF e CONTACT
            const user = {
                ID: doc.id, // ID do documento
                NAME: doc.data().NAME,
                CPF: formatCPF(doc.data().CPF), // Formata o CPF
                CONTACT: doc.data().CONTACT,
                EMAIL: doc.data().EMAIL
            };
            userList.push(user);
        });

        setUsers(userList);
        console.log(userList)
    } catch (error) {
        console.error("Error getting users:", error);
    }
};