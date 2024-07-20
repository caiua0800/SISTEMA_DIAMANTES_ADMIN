import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from 'react-redux';
import { getSaques, setAceitoSaques } from '../redux/actions';
import { formatCPF } from "./ASSETS/assets";

const closeIcon = 'https://firebasestorage.googleapis.com/v0/b/wldata.appspot.com/o/cancel-close-delete-svgrepo-com.png?alt=media&token=b0d9ff03-fef7-4eb4-8bae-f6624f1483f2';
const payIco = 'https://firebasestorage.googleapis.com/v0/b/wldata.appspot.com/o/payment-pay-later-svgrepo-com.png?alt=media&token=13b149d1-cdad-49e3-9e78-e85ca4940274';
const reloadIcon = 'https://firebasestorage.googleapis.com/v0/b/wldata.appspot.com/o/reload-svgrepo-com%20(1).png?alt=media&token=c99468e4-47db-4616-8788-540ef032113e'; 

export default function SaquesFeitos() {
    const [search, setSearch] = useState('');
    const [filterOption, setFilterOption] = useState('pendentes');

    const dispatch = useDispatch();
    const saques = useSelector(state => state.SaquesReducer.saques);

    useEffect(() => {
        dispatch(getSaques());
    }, [dispatch]);

    const filteredClients = saques.filter(user => {
        const matchesSearch = search.length > 0
            ? (user.NAME && user.NAME.includes(search.toUpperCase())) ||
              (user.ID && user.ID.includes(search.toUpperCase()))
            : true;

        const matchesFilter = 

            filterOption === 'aceitos'
            ? user.PENDENTE && user.APROVADO
            : filterOption === 'negados'
            ? user.PENDENTE && !user.APROVADO
            : true;

        return matchesSearch && matchesFilter;
    });

    return (
        <SaquesContainer>
            <SaquesFirstContent>
                <AreaTitle>OPERAÇÕES DE SAQUES</AreaTitle>
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

                <SearchCheck>
                    <div>
                        <input
                            type="radio"
                            id="negados"
                            name="saquesFilter"
                            value="negados"
                            checked={filterOption === 'negados'}
                            onChange={() => setFilterOption('negados')}
                        />
                        <label htmlFor="negados">SAQUES NEGADOS</label>
                    </div>
                    <div>
                        <input
                            type="radio"
                            id="aceitos"
                            name="saquesFilter"
                            value="aceitos"
                            checked={filterOption === 'aceitos'}
                            onChange={() => setFilterOption('aceitos')}
                        />
                        <label htmlFor="aceitos">SAQUES ACEITOS</label>
                    </div>
                </SearchCheck>

                <SaquesTable>
                    <TableContainer>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHeaderCell>ID</TableHeaderCell>
                                    <TableHeaderCell>CLIENTE</TableHeaderCell>
                                    <TableHeaderCell>CPF</TableHeaderCell>
                                    <TableHeaderCell>DATA SOLICITAÇÃO</TableHeaderCell>
                                    <TableHeaderCell>OBSERVAÇÕES</TableHeaderCell>
                                    <TableHeaderCell>VALOR</TableHeaderCell>
                                    <TableHeaderCell>FUNDO</TableHeaderCell>
                                    <TableHeaderCell>APROVADO</TableHeaderCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredClients.map((user, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{user.IDSAQUE}</TableCell>
                                        <TableCell>{user.NAME}</TableCell>
                                        <TableCell>{formatCPF(user.ID)}</TableCell>
                                        <TableCell>{user.DATA}</TableCell>
                                        <TableCell>{user.APROVADO ? user.DADOSRECEBIMENTO :user.OBS}</TableCell>
                                        <TableCell>$ {user.VALOR}</TableCell>
                                        <TableCell>{user.FUNDO_ESCOLHIDO === 'SALDORECOMPRA' ? 'RECOMPRA' : 'INDICAÇÃO'}</TableCell>
                                        <TableCell>{(user.APROVADO ? 'APROVADO' : 'NEGADO')}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </SaquesTable>
            </SaquesContent>
        </SaquesContainer>
    );
}

const SearchCheck = styled.div`
    display: flex;
    width: 100%;
    justify-content: start;
    padding: 10px 0 0 30px;
    box-sizing: border-box;
    gap: 20px;

    div {
        display: flex;
        align-items: center;
    }

    input {
        margin-right: 10px;
    }

    label {
        cursor: pointer;
    }

    @media (max-width: 1200px){
        flex-direction: column;
        align-items: end;
        padding: 0;
        margin-top: 20px;
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