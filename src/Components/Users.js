// Users.js

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export default function Clientes() {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');

    const getUsers = async () => {
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

    useEffect(() => {
        getUsers();
    }, []);

    const filteredClients = search.length > 0
        ? users.filter(user => user.NAME.includes(search.toUpperCase()))
        : users;

    const formatCPF = (cpf) => {
        cpf = cpf.replace(/\D/g, '');
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    };

    return (
        <UsersContainer>
            <UsersFirstContent>
                <AreaTitle>USUÁRIOS DO SISTEMA</AreaTitle>
                <AddClient>+ ADICIONAR USUÁRIO</AddClient>
            </UsersFirstContent>

            <Users>
                <SearchBar>
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        type="text"
                        placeholder="Nome do Cliente"
                    />
                </SearchBar>

                <UsersTable>
                    <TableContainer>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHeaderCell>ID</TableHeaderCell>
                                    <TableHeaderCell>NOME</TableHeaderCell>
                                    <TableHeaderCell>CPF</TableHeaderCell>
                                    <TableHeaderCell>E-MAIL</TableHeaderCell>
                                    <TableHeaderCell>CELULAR</TableHeaderCell>
                                    <TableHeaderCell>CARGO</TableHeaderCell>
                                    <TableHeaderCell>OPÇÕES</TableHeaderCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredClients.map((user, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{user.ID}</TableCell>
                                        <TableCell>{user.NAME}</TableCell>
                                        <TableCell>{user.CPF}</TableCell>
                                        <TableCell>{user.EMAIL}</TableCell>
                                        <TableCell>{user.CONTACT}</TableCell>
                                        <TableCell>ADMIN</TableCell>
                                        <TableCell>{index + 1}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </UsersTable>
            </Users>
        </UsersContainer>
    );
}

const UsersContainer = styled.div`
    width: 100%;
    height: 100vh;
    overflow:hidden;
    box-sizing: border-box;
    padding: 40px 40px;
    background-color: rgba(22, 22, 22, 1);
    color: #f2f2f2;

    @media (max-width: 915px){
        padding: 40px 20px;
    }
`;

const UsersFirstContent = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-top: 50px;
    box-sizing: border-box;
    align-items: center;

    @media (max-width: 915px){
        flex-direction: column;
        gap: 10px;
    }
`;

const AreaTitle = styled.h1`
    text-shadow: 1px 1px 2px rgba(255,255,255,0.2);
    cursor: pointer;
    margin: 0;
    transition: .3s;

    &:hover{
        text-shadow: 1px 1px 2px rgba(255,255,255,0);
        color: rgba(0,0,0,0.6);
    }
`;

const AddClient = styled.button`
    padding: 10px 20px;
    box-sizing: border-box;
    background-color: #f96d00;
    color: #f2f2f2;
    border: 0;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.6);
    cursor: pointer;
    transition: .3s;
    &:hover{
        background-color: #393e46;
        color: #f96d00;
    }
`;

const Users = styled.div`
    width: 100%;
    background-color: #393e46; 
    box-sizing: border-box;
    margin-top: 50px;
    padding-bottom: 30px;

    @media (max-width: 915px){
        padding: 20px;
    }
`;

const SearchBar = styled.div`
    width: 100%;
    box-sizing: border-box;
    padding: 30px;

    input{
        box-sizing: border-box;
        width: 100%;
        height: 40px;
        background-color: #222831;
        border: 0;
        padding-left: 30px;
        box-shadow: 1px 1px 2px black;
        color: #f2f2f2;
        text-transform: uppercase;
    }

    @media (max-width: 915px){
        padding: 0px;
    }
`;

const UsersTable = styled.div`
    width: 100%;
    background-color: #393e46; 
    box-sizing: border-box;
    padding: 0 30px 0 30px;
    margin-top: 30px;
    min-height: 300px;
    max-height: 500px;
    overflow-y: hidden;
    overflow-x: hidden;

    display: flex;
    justify-content: center;
    @media (max-width: 915px){
        
        min-height: 300px;
        padding: 0;
        border: 2px solid rgba(0,0,0,0.2);
        max-height: 250px;
    }
`;

const TableContainer = styled.div`
    width: 100%;
    box-sizing: border-box;    
    overflow-y: scroll;
    overflow-x: scroll;

`;

const Table = styled.table`
    width: 100%;
    overflow: auto; 
    border-collapse: collapse;
    border: 1px solid rgba(0, 0, 0, 0.1);
    box-shadow: -2px 2px 2px rgba(0, 0, 0, 0.2);
    position: relative;

    @media (max-width: 915px){
    }
`;

const TableHeader = styled.thead`

    color: #f2f2f2;
`;

const TableRow = styled.tr`
    background-color: #393e46;
    color: #f2f2f2;
    &:nth-child(even) {
        color: #222831;
        background-color: rgba(57, 62, 70, 0.8);
    }
`;

const TableHeaderCell = styled.th`
    padding: 15px;
    text-align: center;
    color: #f2f2f2;
    background-color: #222831;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    min-width: 100px; /* Ajuste conforme necessário */
    white-space: nowrap;
`;

const TableBody = styled.tbody`
    background-color: white;
`;

const TableCell = styled.td`
    padding: 15px;
    text-align: center;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    min-width: 100px; /* Ajuste conforme necessário */
    white-space: nowrap;
`;

const ImgClient = styled.div`
    width: 40px;
    height: 40px;
    border-radius: 50%;

    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f96d00;
`;