// Users.js

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export default function Clientes() {
    const [users, setUsers] = useState([]);

    // Função para buscar os usuários na coleção USERS
    const getUsers = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'USERS'));
            let userList = [];
            querySnapshot.forEach((doc) => {
                // Para cada documento, extrair os campos NAME, CPF e CONTACT
                const user = {
                    id: doc.id, // ID do documento
                    name: doc.data().NAME,
                    cpf: formatCPF(doc.data().CPF), // Formata o CPF
                    contact: doc.data().CONTACT
                };
                userList.push(user);
            });

            setUsers(userList); // Atualiza o estado com a lista de usuários
        } catch (error) {
            console.error("Error getting users:", error);
        }
    };

    useEffect(() => {
        getUsers();
    }, []);

    // Função para formatar o CPF (adiciona pontos e traço)
    const formatCPF = (cpf) => {
        // Remove caracteres não numéricos
        cpf = cpf.replace(/\D/g, '');

        // Aplica a formatação com pontos e traço
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    };

    return (
        <UsersContent>
            <h1>Lista de Usuários</h1>
            <UserTable>
                <thead>
                    <tr>
                        <TableHeader>Nome</TableHeader>
                        <TableHeader>CPF</TableHeader>
                        <TableHeader>Contato</TableHeader>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell>{user.name}</TableCell>
                            <TableCell>{user.cpf}</TableCell>
                            <TableCell>{user.contact}</TableCell>
                        </TableRow>
                    ))}
                </tbody>
            </UserTable>

        </UsersContent>
    );
}

const UsersContent = styled.div`
    width: 100%;
    height: 100vh;
    overflow:hidden;
    padding-left: 120px;
    box-sizing: border-box;
    padding-right: 40px;
    background-color: rgba(22, 22, 22, 1);
    color: white;
`;

const UserTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
`;

const TableHeader = styled.th`
  background-color: rgba(2, 54, 109, 1);
  color: white;
  padding: 10px;
  border: 1px solid #ddd;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: rgba(0, 97, 202, 0.8);
  }
    color: white;
    background-color: rgba(64, 156, 255, 1);
`;

const TableCell = styled.td`
  padding: 10px;
  border: 1px solid #ddd;
`;
