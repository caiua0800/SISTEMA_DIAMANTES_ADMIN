import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { collection, getDocs, doc, updateDoc, setDoc } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { db } from '../firebaseConfig';
import { createUser } from '../redux/actions';
import { useDispatch, useSelector } from 'react-redux';

export default function Clientes() {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const dispatch = useDispatch();
    const [modalName, setModalName] = useState('');
    const [modalCPF, setModalCPF] = useState('');
    const [modalContato, setModalContato] = useState('');
    const [modalCargo, setModalCargo] = useState('');
    const [modalEmail, setModalEmail] = useState('');
    const [modalPass1, setModalPass1] = useState('');
    const [modalPass2, setModalPass2] = useState('');
    const [modalShow, setModalShow] = useState(false);

    const lockedIcon = 'https://firebasestorage.googleapis.com/v0/b/wldata.appspot.com/o/cadeado%20locked.png?alt=media&token=ff38c533-61da-41e6-ad4a-2e0392c4cfa0';
    const unlockedIcon = 'https://firebasestorage.googleapis.com/v0/b/wldata.appspot.com/o/cadeado%20unlocked.png?alt=media&token=a1f5e8c1-0367-4680-9ebe-97000572e991';

    const getUsers = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'ADMIN'));
            let userList = [];
            querySnapshot.forEach((doc) => {
                const user = {
                    ID: doc.id,
                    NAME: doc.data().NAME,
                    CPF: formatCPF(doc.data().CPF),
                    CONTACT: doc.data().CONTACT,
                    CARGO: doc.data().CARGO,
                    EMAIL: doc.data().EMAIL,
                    ALLOW: doc.data().ALLOW,
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

    const handleAllowToggle = async (userID, currentAllow) => {
        try {
            const adminDocRef = doc(db, 'ADMIN', userID);
            const updatedAllow = !currentAllow;

            await updateDoc(adminDocRef, { ALLOW: updatedAllow });

            setUsers(prevUsers =>
                prevUsers.map(user =>
                    user.ID === userID ? { ...user, ALLOW: updatedAllow } : user
                )
            );

        } catch (error) {
            console.error('Error toggling ALLOW:', error);
        }
    };

    const handleCancelarModalClick = () => {
        setModalName('');
        setModalCPF('');
        setModalContato('');
        setModalEmail('');
        setModalPass1('');
        setModalPass2('');
        setModalCargo('');
        setModalShow(false);
    };

    const handleCriarModalClick = async () => {
        if (modalPass1 !== modalPass2) {
            alert('As senhas não coincidem');
            return;
        }

        dispatch(createUser(modalName, modalCPF, modalEmail, modalContato, modalCargo, modalPass1));
        handleCancelarModalClick();
        getUsers();
    };

    return (
        <UsersContainer>
            <UsersFirstContent>
                <AreaTitle>USUÁRIOS DO SISTEMA</AreaTitle>
                <AddClient onClick={() => setModalShow(true)}>+ ADICIONAR USUÁRIO</AddClient>
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
                                        <TableCell>{user.NAME}</TableCell>
                                        <TableCell>{user.CPF}</TableCell>
                                        <TableCell>{user.EMAIL}</TableCell>
                                        <TableCell>{user.CONTACT}</TableCell>
                                        <TableCell>{user.CARGO}</TableCell>
                                        <TableCell>
                                            <OptionsGroup>
                                                <button onClick={() => handleAllowToggle(user.ID, user.ALLOW)}>
                                                    <img src={user.ALLOW ? unlockedIcon : lockedIcon} alt="Alterar permissão" />
                                                </button>
                                            </OptionsGroup>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </UsersTable>
            </Users>

            {modalShow && (
                <ModalAddUser>
                    <ModalContent>
                        <ModalTitle>INFORMAÇÕES NOVO USUÁRIO</ModalTitle>
                        <ModalInputs>
                            <div>
                                <h4>NOME</h4>
                                <input
                                    type="text"
                                    onChange={e => setModalName(e.target.value)}
                                    value={modalName}
                                />
                            </div>
                            <div>
                                <h4>CPF</h4>
                                <input
                                    type="text"
                                    onChange={e => setModalCPF(e.target.value)}
                                    value={modalCPF}
                                />
                            </div>
                            <div>
                                <h4>CONTATO</h4>
                                <input
                                    type="text"
                                    onChange={e => setModalContato(e.target.value)}
                                    value={modalContato}
                                />
                            </div>
                            <div>
                                <h4>CARGO</h4>
                                <input
                                    type="text"
                                    onChange={e => setModalCargo(e.target.value)}
                                    value={modalCargo}
                                />
                            </div>
                            <div>
                                <h4>EMAIL</h4>
                                <input
                                    type="text"
                                    onChange={e => setModalEmail(e.target.value)}
                                    value={modalEmail}
                                />
                            </div>
                            <div>
                                <h4>SENHA</h4>
                                <input
                                    type="password"
                                    onChange={e => setModalPass1(e.target.value)}
                                    value={modalPass1}
                                />
                            </div>
                            <div>
                                <h4>CONFIRME A SENHA</h4>
                                <input
                                    type="password"
                                    onChange={e => setModalPass2(e.target.value)}
                                    value={modalPass2}
                                />
                            </div>
                        </ModalInputs>
                        <ModalButtons>
                            <button className="cancelar" onClick={handleCancelarModalClick}>
                                CANCELAR
                            </button>
                            <button className="criar" onClick={handleCriarModalClick}>
                                CRIAR
                            </button>
                        </ModalButtons>
                    </ModalContent>
                </ModalAddUser>
            )}
        </UsersContainer>
    );
}


const ModalAddUser = styled.div`
    position: fixed;
    width: 100%;
    top: 0;
    left: 0;
    z-index: 1000;
    display: flex;
    height: 100%;
    justify-content: center;
    align-items: center;
    background-color: rgba(0,0,0,0.6);
`;

const ModalContent = styled.div`
    width: 600px;
    height: max-content;
    background-color: rgba(22, 22, 22, 1);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px 30px 40px 30px;
    box-sizing: border-box;
`;

const ModalTitle = styled.h2`
    color: white;
    width: 100%;
    text-align: center;
`;

const ModalInputs = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-top: 20px;
    width: 100%;
    div{
        h4{
            margin: 0;
            font-size: 22px;
            color: rgba(255, 255, 255, 0.7);
        }

        input{
            width: 80%;
            height: 30px;
            padding-left: 20px;
            box-sizing: border-box;
            color: white;
            font-size: 18px;
            background-color: rgba(0,0,0,0.5);
        }
    }
`;
const ModalButtons = styled.div`
    padding: 0 30px;
    box-sizing: border-box;
    margin-top: 10px;
    width: 100%;
    display: flex;
    gap: 10px;
    justify-content: center;

    button{
        width: 100%;
        height: 40px;
        cursor: pointer;        
        color: white;
        font-size: 18px;
        border: 2px solid transparent;
        transition: .3s;

        &:hover{
            border: 2px solid white;
            background-color: transparent;
        }
    }

    .cancelar{
        background-color: rgba(223, 17, 17, 1);

    }

    .criar{
        background-color: rgba(38, 181, 13, 1);
    }

`;

const UsersContainer = styled.div`
    width: 100%;
    height: 100vh;
    overflow:hidden;
    box-sizing: border-box;
    padding: 40px 40px;
    background-color: rgba(22, 22, 22, 1);
    color: #f2f2f2;
    position: relative;
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


const OptionsGroup = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 6px;
    button{
        display: flex;
        cursor: pointer;
        align-items: center;
        width: 40px;
        background-color: rgba(255, 255, 255, 1);
        transition: .3s;
        &:hover{
            background-color: rgba(0, 255, 255, 1);
        }

        img{
            width: 100%;
            height: 100%;
        }
    }
`;