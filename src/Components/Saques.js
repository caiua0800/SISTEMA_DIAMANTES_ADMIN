import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from 'react-redux';
import { getSaques, setAceitoSaques } from '../redux/actions';
import { auth } from '../DATABASE/firebaseConfig'; 
import { signInWithEmailAndPassword } from 'firebase/auth';

const closeIcon = 'https://firebasestorage.googleapis.com/v0/b/wldata.appspot.com/o/cancel-close-delete-svgrepo-com.png?alt=media&token=b0d9ff03-fef7-4eb4-8bae-f6624f1483f2';
const payIco = 'https://firebasestorage.googleapis.com/v0/b/wldata.appspot.com/o/payment-pay-later-svgrepo-com.png?alt=media&token=13b149d1-cdad-49e3-9e78-e85ca4940274';
const reloadIcon = 'https://firebasestorage.googleapis.com/v0/b/wldata.appspot.com/o/reload-svgrepo-com%20(1).png?alt=media&token=c99468e4-47db-4616-8788-540ef032113e'; 



export default function Saques() {
    const [search, setSearch] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [userINFOMODAL, setUserINFOMODAL] = useState({})
    const [modalData, setModalData] = useState({
        metodoPagamento: 'TED',
        aprovarTransacao: 'APROVAR SAQUE',
        responsavelEmail: '',
        responsavelSenha: '',
        observacoes: ''
    });



    const dispatch = useDispatch();
    const saques = useSelector(state => state.SaquesReducer.saques);

    useEffect(() => {
        dispatch(getSaques());
    }, [dispatch]);

    const filteredClients = search.length > 0
    ? saques.filter(user => {
        return (
            (user.NAME && user.NAME.includes(search.toUpperCase())) ||
            (user.ID && user.ID.includes(search.toUpperCase()))
        );
    }).filter(user => !user.PENDENTE) // Filtra se PENDENTE for false
    : saques.filter(user => !user.PENDENTE); // Filtra se PENDENTE for false quando não há pesquisa



    const handleOpenModal = (userId, saqueId, valor, fundo_escolhido) => {
        setModalOpen(true);
        setUserINFOMODAL({userId, saqueId, valor, fundo_escolhido})
    };

    const handleAproveChange = async () => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, modalData.responsavelEmail, modalData.responsavelSenha);
            // Login successful
            console.log("User logged in:", userCredential.user);
    
            // Dispatch actions based on approval decision
            dispatch(setAceitoSaques(userINFOMODAL.userId, userINFOMODAL.saqueId, modalData.aprovarTransacao === 'APROVAR SAQUE', modalData.metodoPagamento, modalData.observacoes, userINFOMODAL.valor, userINFOMODAL.fundo_escolhido));
            closeModal();
            alert("TRANSAÇÃO AUTORIZADA");
            dispatch(getSaques());
        } catch (error) {
            alert("ACESSO NEGADO OU INEXISTENTE");
            dispatch(getSaques());
        }
    };

    const handleSaveAceitoModal = () => {

        if(modalData.responsavelEmail && modalData.responsavelSenha){
            handleAproveChange()
        }else{
            alert("INSIRA O EMAIL E A SENHA");
        }

        // dispatch(setAceitoSaques(userINFOMODAL.userId, userINFOMODAL.saqueId, modalData.aprovarTransacao === 'APROVAR SAQUE' ? true : false));
        // dispatch(getSaques());
        // closeModal();
    }

    const handleReload = () => {
        dispatch(getSaques());
    };

    const openModal = () => {
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setModalData({
            metodoPagamento: 'TED',
            aprovarTransacao: 'APROVAR SAQUE',
            responsavelEmail: '',
            responsavelSenha: '',
            observacoes: ''
        });
    };

    const handleChangeModalData = (e) => {
        const { name, value } = e.target;
        setModalData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };




    return (
        <SaquesContainer>
            <SaquesFirstContent>
                <AreaTitle>SAQUES</AreaTitle>
                {/* <AddSaques onClick={openModal}>+ REALIZAR NOVO SAQUE</AddSaques> */}
            </SaquesFirstContent>

            <SaquesContent>
                <SearchBar>
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        type="text"
                        placeholder="FILTRAR"
                    />
                </SearchBar>

                <ReloadData>
                    <p onClick={handleReload}><img src={reloadIcon} alt="https://firebasestorage.googleapis.com/v0/b/wldata.appspot.com/o/reload-svgrepo-com.png?alt=media&token=239c954a-c1fc-4829-839e-694b067a90f5" /></p>
                </ReloadData>

                <SaquesTable>
                    <TableContainer>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHeaderCell>ID</TableHeaderCell>
                                    <TableHeaderCell>CLIENTE</TableHeaderCell>
                                    <TableHeaderCell>DATA SOLICITAÇÃO</TableHeaderCell>
                                    <TableHeaderCell>PRAZO DE VALIDAÇÃO</TableHeaderCell>
                                    <TableHeaderCell>VALOR</TableHeaderCell>
                                    <TableHeaderCell>FUNDO</TableHeaderCell>
                                    <TableHeaderCell>APROVADO</TableHeaderCell>
                                    <TableHeaderCell>OPÇÕES</TableHeaderCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredClients.map((user, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{user.IDSAQUE}</TableCell>
                                        <TableCell>{user.NAME}</TableCell>
                                        <TableCell>{user.DATA}</TableCell>
                                        <TableCell>{user.DATA}</TableCell>
                                        <TableCell>$ {user.VALOR}</TableCell>
                                        <TableCell>{(user.FUNDO_ESCOLHIDO === 'SALDORECOMPRA' ? 'RECOMPRA' : 'INDICAÇÃO')}</TableCell>
                                        <TableCell>{user.PENDENTE ? (user.APROVADO ? 'APROVADA' : 'NEGADO') : 'PENDENTE'}</TableCell>
                                        <TableCell>
                                            <OptionsButtons>
                                                {/* <button onClick={() => handleSetNegado(user.ID, user.IDSAQUE)}>Negar</button>
                                                <button onClick={() => handleSetAceito(user.ID, user.IDSAQUE)}>Aceitar</button> */}
                                                <img onClick={() => {handleOpenModal(user.ID, user.IDSAQUE, user.VALOR, user.FUNDO_ESCOLHIDO)}} src={payIco} alt="payIco"/>
                                            </OptionsButtons>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </SaquesTable>
            </SaquesContent>

            {modalOpen && (
                <ModalAceitar>
                    <ModalAceitarContent>
                        <UserINFO></UserINFO>
                        <CancelIcon onClick={closeModal}>
                            <img src={closeIcon} alt="icon" />
                        </CancelIcon>
                        <ModalAceitarTitle>
                            INFORMAÇÕES DE SAÍDA
                        </ModalAceitarTitle>

                        <ModalAceitarInfo>
                            <div>
                                <span>MÉTODO DE PAGAMENTO:</span>
                                <select
                                    name="metodoPagamento"
                                    value={modalData.metodoPagamento}
                                    onChange={handleChangeModalData}
                                >
                                    <option value="TED">TED</option>
                                    <option value="PIX">PIX</option>
                                    <option value="EM ESPÉCIE">EM ESPÉCIE</option>
                                    <option value="DEPÓSITO BANCÁRIO">DEPÓSITO BANCÁRIO</option>
                                    <option value="NEGADO">NEGADO</option>
                                </select>
                            </div>

                            <div>
                                <span>APROVAR TRANSAÇÃO:</span>
                                <select
                                    name="aprovarTransacao"
                                    value={modalData.aprovarTransacao}
                                    onChange={handleChangeModalData}
                                >
                                    <option value="APROVAR SAQUE">APROVAR SAQUE</option>
                                    <option value="NEGAR SAQUE">NEGAR SAQUE</option>
                                </select>
                            </div>

                            <div>
                                <span>RESPONSÁVEL EMAIL:</span>
                                <input
                                    type="email"
                                    name="responsavelEmail"
                                    value={modalData.responsavelEmail}
                                    onChange={handleChangeModalData}
                                />
                            </div>

                            <div>
                                <span>RESPONSÁVEL SENHA:</span>
                                <input
                                    type="password"
                                    name="responsavelSenha"
                                    value={modalData.responsavelSenha}
                                    onChange={handleChangeModalData}
                                />
                            </div>

                            <Obs>
                                <span>OBSERVAÇÕES:</span>
                                <textarea
                                    name="observacoes"
                                    value={modalData.observacoes}
                                    onChange={handleChangeModalData}
                                ></textarea>
                            </Obs>

                        </ModalAceitarInfo>


                        <ModalAceitarButtons>
                            <button className="cancelarModal" onClick={closeModal}>CANCELAR</button>
                            <button className="aceitarModal" onClick={handleSaveAceitoModal}>ENVIAR</button>
                        </ModalAceitarButtons>

                    </ModalAceitarContent>
                </ModalAceitar>
            )}
        </SaquesContainer>
    );
}

const UserINFO = styled.div`
    display: none;
`;

const ModalAceitar = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.6);

    display: flex;
    justify-content: center;
    z-index: 1000;
    align-items: center;
`;

const ModalAceitarContent = styled.div`
    width: 1250px;
    background-color: white;
    border-radius: 3px;
    padding: 30px;
    box-sizing: border-box;
    position: relative;
`;

const CancelIcon = styled.div`
    width: 20px;
    overflow: hidden;
    display: flex;
    position: absolute;
    top: 15px;
    right: 15px;

    img{
        width: 100%;
        cursor: pointer;
        transition: .3s;

        &:hover{
            transform: scale(1.5);
        }
    }
`;

const ModalAceitarTitle = styled.h2`
    margin: 0;
    color: rgba(218, 143, 8, 0.8);
    transition: .6s;
    wisth: 100%;
    display: flex;
    justify-content: start;
    cursor:pointer;
    &:hover{
        margin-left: 40px;
    }
`;

const ModalAceitarInfo = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    margin-top: 30px;
    height: max-content;
    gap: 10px;
    align-items: flex-start; /* Alinha os itens à esquerda */
    justify-content: center;
    box-sizing: border-box;

    div {
        display: flex;
        gap: 10px;
        align-items: center;
        box-sizing: border-box;
        width: 100%;
        span {
            min-width: 200px; /* Define uma largura mínima para os spans */
            font-size: 16px;
            color: rgba(0, 0, 0, 0.6);
            font-weight: 600;
            text-align: left; /* Alinha o texto à esquerda */
        }

        select,
        input {
            flex: 1; 
            height: 35px;
            color: rgba(0, 0, 0, 0.6);
            box-sizing: border-box;
            padding: 5px;
        }


    }
`;

const Obs = styled.div`
    display: flex;
    gap: 10px;
    align-items: center;
    box-sizing: border-box;
    flex-direction: column;
    margin-top: 10px;
    width: 100%;

    span {
        min-width: 200px; 
        font-size: 16px;
        color: rgba(0, 0, 0, 0.6);
        font-weight: 600;
        text-align: left; /* Alinha o texto à esquerda */
    }

    textarea{
        width: 100%;
        height: 100px;
        color: rgba(0,0,0,0.7);
        font-size: 16px;
        box-sizing: border-box;
        padding: 5px 30px;
    }
`;

const ModalAceitarButtons = styled.div`
    margin-top: 20px;
    width: 100%;
    justify-content: space-between;
    gap: 20px;
    display: flex;

    button{
        height: 40px;
        color: white;
        width: 120px;
        transition: .3s;
        border: 0;
        border-radius: 3px;
        cursor: pointer;
    }

    .cancelarModal{
        background-color: rgba(199, 6, 6, 0.8);
        &:hover{
            background-color: rgba(199, 6, 6, 1);
        }
    }

    .aceitarModal{
        background-color: rgba(26, 199, 6, 0.8);
        &:hover{
            background-color: rgba(26, 199, 6, 1);
        }
    }
`;


const SaquesContainer = styled.div`
    width: 100%;
    height: 100vh;
    overflow:hidden;
    box-sizing: border-box;
    padding: 40px 40px;
    background: linear-gradient(to right, #001D3D, #003566, #001D3D);
    color: #f2f2f2;
    position: relative;
    @media (max-width: 915px){
        padding: 40px 20px;
    } 
`;

const SaquesFirstContent = styled.div`
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
        color: #FFC300;
        padding-left: 20px;
    }
`;

const AddSaques = styled.button`
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

const SaquesContent = styled.div`
    width: 100%;
    background: linear-gradient(to right, #003566, #001D3D , #003566);  
    box-sizing: border-box;
    margin-top: 50px;
    padding-bottom: 30px;
    box-shadow: 3px 3px 1px black;

    @media (max-width: 915px){
        padding: 20px;
    }
`;

const SearchBar = styled.div`
    width: 100%;
    box-sizing: border-box;
    padding: 30px;
    background: linear-gradient(to right, #003566, #001D3D , #003566); 
    input{
        box-sizing: border-box;
        width: 100%;
        height: 40px;
        background: linear-gradient(to right, #000814, #001D3D, #000814);
        border: 0;
        padding-left: 30px;
        box-shadow: 1px 1px 2px black;
        color: rgba(255, 195, 0, 1);
        font-weight: 600;
        text-transform: uppercase;
    }

    @media (max-width: 915px){
        padding: 0px;
    }
`;

const SaquesTable = styled.div`
    width: 100%;
    background: linear-gradient(to right, #003566, #001D3D , #003566); 
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
`;

const TableHeader = styled.thead`
    color: #f2f2f2;
`;

const TableRow = styled.tr`
    background: #000814; 
    color: #FFC300;

    &:nth-child(even) {
        color: #FFC300;
        background-color: #001D3D;
    }
`;

const TableHeaderCell = styled.th`
    padding: 15px;
    text-align: center;
    color: #219ebc;
    background-color: #001D3D;
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

const OptionsButtons = styled.div`
    // display: flex;
    // justify-content: center;
    // gap: 2px;

    // button{
    //     cursor: pointer;
    // }

    display: flex;
    align-items: center;
    justify-content: center;

    img{
        width: 40px;
        cursor: pointer;
        transition: .3s;

        &:hover{
            transform: scale(1.3);
        }
    }
`;

const ReloadData = styled.div`
    width: 100%;
    display: flex;
    justify-content: end;

    p{
        margin: 0;
        padding-right: 60px;
        cursor: pointer;

        img{
            width: 30px;
            transition: .3s;

            &:hover{
                transform: scale(1.3);
            }
        }
    }

`;