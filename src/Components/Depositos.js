import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export default function Depositos() {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');

    const getUsers = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'USERS'));
            let userList = [];
            querySnapshot.forEach((doc) => {
                const user = {
                    ID: doc.id,
                    NAME: doc.data().NAME,
                    CPF: formatCPF(doc.data().CPF),
                    CONTACT: doc.data().CONTACT,
                    EMAIL: doc.data().EMAIL
                };
                userList.push(user);
            });

            setUsers(userList);
            console.log(userList);
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
        <DepositosContainer>
            <DepositosFirstContent>
                <AreaTitle>DEPÓSITOS</AreaTitle>
                <AddDepositos>+ REALIZAR NOVO DEPÓSITO</AddDepositos>
            </DepositosFirstContent>

            <DepositosContent>
                <SearchBar>
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        type="text"
                        placeholder="Nome do Cliente"
                    />
                </SearchBar>

                <DepositosTable>
                    <TableContainer>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHeaderCell>ID</TableHeaderCell>
                                    <TableHeaderCell>CLIENTE</TableHeaderCell>
                                    <TableHeaderCell>CELULAR</TableHeaderCell>
                                    <TableHeaderCell>DATA SOLICITAÇÃO</TableHeaderCell>
                                    <TableHeaderCell>PRAZO DE VALIDAÇÃO</TableHeaderCell>
                                    <TableHeaderCell>VALOR</TableHeaderCell>
                                    <TableHeaderCell>STATUS</TableHeaderCell>
                                    <TableHeaderCell>AÇÕES</TableHeaderCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredClients.map((user, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{user.ID}</TableCell>
                                        <TableCell>{user.NAME}</TableCell>
                                        <TableCell>{user.CONTACT}</TableCell>
                                        <TableCell>{user.EMAIL}</TableCell>
                                        <TableCell>{user.CONTACT}</TableCell>
                                        <TableCell>R$ 00,00</TableCell>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{index + 1}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </DepositosTable>
            </DepositosContent>
        </DepositosContainer>
    );
}

const DepositosContainer = styled.div`
    width: 100%;
    height: 100vh;
    overflow:hidden;
    box-sizing: border-box;
    padding: 40px 0px;
    background-color: #22313f;
    color: #f1f1f1;

    @media (max-width: 915px){
        padding: 40px 20px;
    }
`;

const DepositosFirstContent = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-top: 50px;
    box-sizing: border-box;
    align-items: center;
    padding: 0 40px;
    @media (max-width: 915px){
        flex-direction: column;
        gap: 10px;
    }
`;

const AreaTitle = styled.h1`
    text-shadow: 1px 1px 2px rgba(255,255,255,0.2);
    cursor: pointer;
    margin: 0;
`;

const AddDepositos = styled.button`
    padding: 10px 20px;
    box-sizing: border-box;
    background-color: #49beb7;
    color: #f2f2f2;
    border: 0;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.6);
    cursor: pointer;
    transition: .3s;

    &:hover{
        background-color: #085f63;
        color: #f1f1f1;
    }
`;

const DepositosContent = styled.div`
    width: 100%;
    background-color: #22313f; 
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
        background-color: #34495e;
        font-weight: 600;
        border: 0;
        padding-left: 30px;
        box-shadow: 1px 1px 2px black;
        color: #f1f1f1;
        text-transform: uppercase;
    }

    @media (max-width: 915px){
        padding: 0px;
    }
`;

const DepositosTable = styled.div`
    width: 100%;
    background-color: #22313f; 
    box-sizing: border-box;
    padding: 0 30px 0 30px;
    margin-top: 30px;
    min-height: 600px;
    max-height: 600px;
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
    overflow-x: hidden;

    @media (max-width: 915px){
        
        overflow-y: scroll;
        overflow-x: scroll;
    }
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
    background-color: #22313f;
    color: #8dc6ff;
    &:nth-child(even) {
        color: #e4f1fe;
        background-color: #34495e;
    }
`;

const TableHeaderCell = styled.th`
    padding: 15px;
    text-align: center;
    color: #f1f1f1;
    background-color: #34495e;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    min-width: 100px;
    // white-space: nowrap;
`;

const TableBody = styled.tbody`
    background-color: white;
`;

const TableCell = styled.td`
    padding: 15px;
    text-align: center;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    min-width: 100px; /* Ajuste conforme necessário */
    // white-space: nowrap;
`;
