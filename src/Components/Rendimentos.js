import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { db } from "../DATABASE/firebaseConfig"; // Importe o db da sua configuração do Firebase
import { doc, getDoc, updateDoc, collection, getDocs } from "firebase/firestore"; // Importe as funções necessárias do Firestore
import { signInWithEmailAndPassword, getAuth } from "firebase/auth"; // Importe as funções necessárias do Firebase Auth
import Loading from "./Loader";
import { consultarALLOWSELL } from "../redux/actions";

export default function Rendimentos() {
    const [rendimentoAtual, setRendimentoAtual] = useState(0);
    const [modalShow, setModalShow] = useState(false);
    const [modalRendimentoShow, setModalRendimentoShow] = useState(false);
    const [modalValue, setModalValue] = useState(rendimentoAtual);
    const [daysInMonth, setDaysInMonth] = useState(30);
    const [adminEmail, setAdminEmail] = useState('');
    const [adminPassword, setAdminPassword] = useState('');
    const [lastRendimento, setLastRendimento] = useState('');
    const [load, setLoad] = useState(false);

    async function fetchRendimentoMensal() {
        setLoad(true);
        try {
            const rendimentoDocRef = doc(db, 'SYSTEM_VARIABLES', 'RENDIMENTO');
            const rendimentoDoc = await getDoc(rendimentoDocRef);

            if (rendimentoDoc.exists()) {
                const rendimentoData = rendimentoDoc.data();
                setRendimentoAtual(rendimentoData.RENDIMENTO_MENSAL);
                setLoad(false);

                // Obter o número de dias no mês atual
                const today = new Date();
                const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
                const days = lastDayOfMonth.getDate();
                setDaysInMonth(days);
            } else {
                setLoad(false);
                console.log('Documento de rendimento não encontrado');
            }
        } catch (error) {
            setLoad(false);
            console.error('Erro ao buscar rendimento mensal:', error);
        }
    }

    async function fetchLastRendimento() {
        setLoad(true);
        try {
            const rendimentoDocRef = doc(db, 'SYSTEM_VARIABLES', 'ULTIMA_VALORIZACAO');
            const rendimentoDoc = await getDoc(rendimentoDocRef);

            if (rendimentoDoc.exists()) {
                const ULTIMA_VALORIZACAOData = rendimentoDoc.data();
                setLastRendimento( (ULTIMA_VALORIZACAOData.PERCENTUAL*100)+'%' + ' => ' + ULTIMA_VALORIZACAOData.DATA + ' - ' + ULTIMA_VALORIZACAOData.HORA);
                setLoad(false);

            } else {
                setLoad(false);
                console.log('Documento de ULTIMA_VALORIZACAO não encontrado');
            }
        } catch (error) {
            setLoad(false);
            console.error('Erro ao buscar ULTIMA_VALORIZACAO:', error);
        }
    }

    useEffect(() => {
        fetchRendimentoMensal();
        fetchLastRendimento();
    }, []);

    useEffect(() => {
        fetchRendimentoMensal();
    }, [lastRendimento])

    const handleSaveRendimento = async () => {
        setLoad(true);

        try {
            const rendimentoDocRef = doc(db, 'SYSTEM_VARIABLES', 'RENDIMENTO');
            await updateDoc(rendimentoDocRef, {
                RENDIMENTO_MENSAL: parseFloat(modalValue)
            });
            setRendimentoAtual(parseFloat(modalValue));
            handleHideModal();
            setLoad(false);

        } catch (error) {
            console.error('Erro ao atualizar rendimento mensal:', error);
            setLoad(false);

        }
    };

    const handleSaveLastRendimento = async () => {
        setLoad(true);
    
        try {
            const rendimentoDocRef = doc(db, 'SYSTEM_VARIABLES', 'ULTIMA_VALORIZACAO');
            
            // Obter a data e hora atual
            const now = new Date();
            const day = String(now.getDate()).padStart(2, '0');
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const year = now.getFullYear();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
    
            // Formatar a data como dd/mm/aaaa
            const formattedDate = `${day}/${month}/${year}`;
            // Formatar a hora como hh:mm
            const formattedTime = `${hours}:${minutes}`;
    
            await updateDoc(rendimentoDocRef, {
                DATA: formattedDate,
                HORA: formattedTime,
                PERCENTUAL: (rendimentoAtual / daysInMonth).toFixed(2),
            });
    
            setRendimentoAtual(parseFloat(modalValue));
            handleHideModal();
            setLoad(false);
    
        } catch (error) {
            console.error('Erro ao atualizar rendimento mensal:', error);
            setLoad(false);
        }
    };
    
    

    const handleShowModal = () => {
        setModalValue(rendimentoAtual);
        setModalShow(true);
    };

    const handleHideModal = () => {
        setModalShow(false);
    };

    const handleLoginAndRun = async () => {
        setLoad(true);
        try {
            const auth = getAuth();
            const userCredential = await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
            console.log('ok'); // Imprime 'ok' no console se o login for bem-sucedido
            setModalRendimentoShow(false); // Fecha o modal após login bem-sucedido
    
            const usersCollectionRef = collection(db, 'USERS');
            const usersSnapshot = await getDocs(usersCollectionRef);
    
            const updatePromises = usersSnapshot.docs.map(async (userDoc) => {
                const userDocRef = doc(db, 'USERS', userDoc.id);
                const userData = userDoc.data();
                const contratos = userData.CONTRATOS;
    
                if (Array.isArray(contratos)) {
                    const updatedContratos = contratos.map(contrato => {
                        if (consultarALLOWSELL(contrato.ALLOWSELL)) {
                            return {
                                ...contrato,
                                LUCRO_OBTIDO: contrato.LUCRO_OBTIDO + (rendimentoAtual / daysInMonth)
                            };
                        } else {
                            return contrato;
                        }
                    });
                    await updateDoc(userDocRef, { CONTRATOS: updatedContratos });
                }
            });
    
            await Promise.all(updatePromises);
            await handleSaveLastRendimento();
            await fetchRendimentoMensal();
            await fetchLastRendimento();
    
            setLoad(false);
            alert('RENDIMENTO ATUALIZADO PARA TODOS OS CLIENTES');
    
        } catch (error) {
            setLoad(false);
            alert('ERRO AO ATUALIZAR RENDIMENTO');
            console.error('Erro ao fazer login ou realizar POST:', error);
        }
    };
    
    useEffect(() => {
        fetchRendimentoMensal();
        fetchLastRendimento();
    }, []);
    
    useEffect(() => {
        fetchLastRendimento();
    }, [lastRendimento]);
    


    return (
        <RendimentosContainer>
            <Loading load={load} />
            <RendimentosBox>
                <RendimentosBoxTitle>Configuração de Rendimentos</RendimentosBoxTitle>

                <RendimentosConfig>
                    <RendimentosAtualDiv>
                        <h4>RENDIMENTO MENSAL</h4>
                        <div>
                            <span>{rendimentoAtual}%</span>
                        </div>
                    </RendimentosAtualDiv>
                    <RendimentosAtualDiv>
                        <h4>RENDIMENTO DIÁRIO</h4>
                        <div>
                            <span>{(rendimentoAtual / daysInMonth).toFixed(2)}%</span>
                        </div>
                    </RendimentosAtualDiv>
                </RendimentosConfig>

                <LastRendimento>
                    <div>
                        <p>ÚLTIMA VALORIZAÇÃO</p>
                        <span>{lastRendimento}</span>
                    </div>
                </LastRendimento>

                <ChangeRendimento>
                    <button onClick={handleShowModal}>MUDAR RENDIMENTO</button>
                </ChangeRendimento>
            </RendimentosBox>

            <RodarRendimentoDiv>
                <button onClick={() => setModalRendimentoShow(true)}>RODAR RENDIMENTO DIÁRIO</button>
            </RodarRendimentoDiv>

            {modalShow && (
                <ModalMudarRendimento>
                    <ModalMudarRendimentoBox>
                        <h4>INFORME A PORCENTAGEM (" % ")</h4>
                        <input
                            type="number"
                            value={modalValue}
                            onChange={(e) => setModalValue(e.target.value)}
                            placeholder="%"
                        />
                        <div>
                            <button onClick={handleHideModal} className="cancelarBtn">CANCELAR</button>
                            <button onClick={handleSaveRendimento} className="salvarBtn">SALVAR</button>
                        </div>
                    </ModalMudarRendimentoBox>
                </ModalMudarRendimento>
            )}

            {modalRendimentoShow && (
                <ModalRodarRendimento>
                    <ModalRodarRendimentoBox>
                        <span className="fecharRodarRend" onClick={() => setModalRendimentoShow(false)}>x</span>
                        <div className="rendimentoTitleModal">
                            <h1>RODAR RENDIMENTO</h1>
                        </div>
                        <div className="informacoesAaplicar">
                            <h4>Rendimento Mensal: {rendimentoAtual}%</h4>
                            <h4>Rendimento Diário: {(rendimentoAtual / daysInMonth).toFixed(2)}%</h4>
                        </div>
                        <div>
                            <div>
                                <span>Email Admin</span>
                                <input type="email" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} />
                            </div>
                            <div>
                                <span>Senha Admin</span>
                                <input type="password" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} />
                            </div>
                            <button onClick={handleLoginAndRun}>RODAR</button>
                        </div>
                    </ModalRodarRendimentoBox>
                </ModalRodarRendimento>
            )}

        </RendimentosContainer>
    );
}


const LastRendimento = styled.div`
    width: 100%;
    display: flex;
    justify-content:center;
    align-items: center;

    div{
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 20px;
        flex-direction: column;

        p{
            margin: 0;
            color: white;
            font-weight: 600;
        }

        span{
            color: white;
        }
    }
`;

const ModalRodarRendimento = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0,0,0,0.6);
`;

const ModalRodarRendimentoBox = styled.div`
    width: 350px;
    height: max-content;
    background-color: rgba(255,255,255,0.9);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 10px;
    box-sizing: border-box;
    padding: 20px;
    position: relative;
    .rendimentoTitleModal {
        h1 {
            margin: 0;
            font-size: 22px;
        }
    }

    .informacoesAaplicar {
        margin-top: 20px;
        h4 {
            margin: 0;
        }
    }

    input {
        width: 100%;
        height: 40px;
        box-sizing: border-box;
        border: 1px solid #ccc;
        border-radius: 4px;
        padding: 8px;
        font-size: 16px;
    }

    button {
        margin-top: 20px;
        width: 100%;
        height: 40px;
        background-color: #4caf50;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.3s ease;
        &:hover {
            background-color: #45a049;
        }
    }

    .fecharRodarRend{
        position: absolute;
        top: 5px;
        right: 10px;
        font-weight: 600;
        cursor: pointer;
    }
`;

const ModalMudarRendimento = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0,0,0,0.6);
`;

const ModalMudarRendimentoBox = styled.div`
    width: 80%;
    height: 250px;
    background-color: rgba(255,255,255,0.9);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 10px;
    box-sizing: border-box;
    padding: 20px;
    h4 {
        margin: 0;
        width: 100%;
        text-align: center;
        font-size: 22px;
    }

    input {
        width: 60%;
        height: 40px;
        box-sizing: border-box;
        border: 0;
        box-shadow: 2px 2px 5px rgba(0,0,0,0.6);
        padding-left: 20px;
    }

    div {
        width: 100%;
        display: flex;
        justify-content: center;
        margin-top: 20px;
        gap: 10px;

        button {
            transition: 0.3s;
            height: 40px;
            width: 100%;
            cursor: pointer;
            box-shadow: 3px 2px 5px rgba(0,0,0,0.6);
        }

        .cancelarBtn {
            background-color: red;
            font-weight: 600;
            border: 0;
        }

        .salvarBtn {
            background-color: greenyellow;
            font-weight: 600;
            border: 0;
        }
    }
`;

const RendimentosContainer = styled.div`
    width: 100%;
    background-color: #222831;
    height: 100vh;
    overflow-y: scroll;
    padding-top: 40px;
    display: flex;
    justify-content: center;
    align-items: start;
    box-sizing: border-box;
    overflow-x: hidden;
    position: relative;

    @media (max-width: 920px) {
        padding: 80px 20px;
    }
`;

const RendimentosBox = styled.div`
    width: 100%;
    display: flex;
    box-sizing: border-box;
    justify-content: start;
    align-items: center;
    flex-direction: column;
`;

const RendimentosBoxTitle = styled.h1`
    color: white;
    font-size: 36px;
    width: 100%;
    text-align: center;
`;

const RendimentosConfig = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 40px;
`;

const RendimentosAtualDiv = styled.div`
    width: 200px;
    height: 120px;
    color: white;
    background-color: rgba(0,0,0,0.6);
    border-radius: 8px;
    box-shadow: 3px 3px 5px rgba(0,0,0,0.5);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;

    h4 {
        margin: 0;
    }
`;

const ChangeRendimento = styled.div`
    margin-top: 20px;
    width: 300px;

    button {
        width: 100%;
        height: 40px;

        font-weight: 600;
        background-color: rgba(255,255,255,0.7);
        border: 0;
        cursor: pointer;
        &:hover {
            background-color: rgba(255,255,255,1);
        }
    }
`;

const RodarRendimentoDiv = styled.div`
    position: absolute;
    bottom: 20px;
    right: 20px;

    button {
        height: 40px;
        font-size: 18px;
        padding: 10px 20px;
        box-sizing: border-box;
        cursor: pointer;

        @media (max-width: 1000px){
            font-size: 12px;
        }
    }
`;
