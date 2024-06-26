import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { formatCPF, getClients, formatNumber } from "./ASSETS/assets";
import firebase from "firebase/compat/app";
import "firebase/compat/storage";
import "firebase/compat/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyCnwSOjrqasUNSCp6UrK2moHd1OtLUMj28",
    authDomain: "wldata.firebaseapp.com",
    projectId: "wldata",
    storageBucket: "wldata.appspot.com",
    messagingSenderId: "86184173654",
    appId: "1:86184173654:web:9463c36b71d142b684dbf7"
};


firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();
const firestore = firebase.firestore();

export default function Validacao() {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        getClients(setUsers);
    }, []);

    const filteredClients = search.length > 0
        ? users.filter(user => user.NAME.includes(search.toUpperCase()))
        : users.filter(user => !user.VERIFICADO && user.DOCSENVIADOS);

    const handleCreateClient = () => {
        window.location.href = '/criarcliente';
    };

    const handleDownloadDoc = (docUrl) => {
        console.log(`Baixar documento: ${docUrl}`);
        window.open(docUrl, '_blank');
    };

    const handleDownloadFace = (faceUrl) => {
        console.log(`Baixar foto da face: ${faceUrl}`);
        window.open(faceUrl, '_blank');
    };

    const formatCPFId = (cpf) => {
        return cpf.replace(/[^\d]/g, ''); // Remove tudo que não for dígito
    };

    const handleAcceptUser = async (cpf) => {
        try {
            const formattedCPF = formatCPFId(cpf);
            const userRef = firestore.collection("USERS").doc(formattedCPF);
            await userRef.update({
                VERIFICADO: true,
            });
            alert(`Usuário com CPF ${cpf} aceito com sucesso!`);
            // Atualize localmente se necessário
            setUsers(prevUsers =>
                prevUsers.map(user =>
                    user.CPF === cpf ? { ...user, VERIFICADO: true } : user
                )
            );
        } catch (error) {
            console.error("Erro ao aceitar usuário:", error);
            alert(`Erro ao aceitar usuário com CPF ${cpf}`);
        }
    };

    const handleDenyUser = async (cpf) => {
        try {
            const formattedCPF = formatCPFId(cpf);
            const userRef = firestore.collection("USERS").doc(formattedCPF);
            await userRef.update({
                DOCSENVIADOS: false,
            });
            alert(`Usuário com CPF ${cpf} negado com sucesso!`);
            // Atualize localmente se necessário
            setUsers(prevUsers =>
                prevUsers.map(user =>
                    user.CPF === cpf ? { ...user, DOCSENVIADOS: false } : user
                )
            );
        } catch (error) {
            console.error("Erro ao negar usuário:", error);
            alert(`Erro ao negar usuário com CPF ${cpf}`);
        }
    };

    return (
        <ClientsContainer>
            <ClientFirstContent>
                <AreaTitle>VALIDAÇÃO DE DOCUMENTOS</AreaTitle>
            </ClientFirstContent>

            <Clients>
                <SearchBar>
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        type="text"
                        placeholder="Nome do Cliente"
                    />
                </SearchBar>

                <ClientsTable>
                    <TableContainer>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHeaderCell>NOME</TableHeaderCell>
                                    <TableHeaderCell>CPF</TableHeaderCell>
                                    <TableHeaderCell>E-MAIL</TableHeaderCell>
                                    <TableHeaderCell>CELULAR</TableHeaderCell>
                                    <TableHeaderCell>FOTO DO DOC.</TableHeaderCell>
                                    <TableHeaderCell>FOTO DA FACE</TableHeaderCell>
                                    <TableHeaderCell>OPÇÕES</TableHeaderCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredClients.map((user, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{user.NAME}</TableCell>
                                        <TableCell>{formatCPF(user.CPF)}</TableCell>
                                        <TableCell>{user.EMAIL}</TableCell>
                                        <TableCell>{user.CONTACT}</TableCell>
                                        <TableCell><button onClick={() => handleDownloadDoc(user.DOCURL)}>VER</button></TableCell>
                                        <TableCell><button onClick={() => handleDownloadFace(user.FACEURL)}>VER</button></TableCell>
                                        <TableCell>
                                            <OptionsVerificacao>
                                                <button onClick={() => handleAcceptUser(user.CPF)}>ACEITAR</button>
                                                <button onClick={() => handleDenyUser(user.CPF)}>NEGAR</button>
                                            </OptionsVerificacao>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </ClientsTable>
            </Clients>
        </ClientsContainer>
    );
}

const ClientsContainer = styled.div`
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

const ClientFirstContent = styled.div`
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

const Clients = styled.div`
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

const ClientsTable = styled.div`
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

    button{
        height: 30px;
        cursor: pointer;
    }
`;

const OptionsVerificacao = styled.div`
    display: flex;
    justify-content: center;
    gap: 2px;

`;
