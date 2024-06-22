import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from 'react-redux';
import { getDepositos } from '../redux/actions';
import { formatNumber } from "./ASSETS/assets";

export default function Contratos() {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState(''); // Estado para filtro por status
    const [dataInicialCompraFilter, setDataInicialCompraFilter] = useState(''); // Estado para filtro por data inicial de compra
    const [dataFinalCompraFilter, setDataFinalCompraFilter] = useState(''); // Estado para filtro por data final de compra
    const [total, setTotal] = useState(0);
    const [totalTaxa, setTotalTaxa] = useState(0);
    const [totalCOINS, setTotalCOINS] = useState(0);
    const [totalGanhos, setTotalGanhos] = useState(0);
    const taxa = 0.3;
    const coinAtualPrice = 158.36;
    const dispatch = useDispatch();
    const depositos = useSelector((state) => state.DepositosReducer.depositos);

    useEffect(() => {
        dispatch(getDepositos());
    }, [dispatch]);


    const filteredClients = depositos.filter(user => {
        const matchesSearch = (user.NAME && user.NAME.toUpperCase().includes(search.toUpperCase())) ||
                             (user.ID && user.ID.toUpperCase().includes(search.toUpperCase()));
        const matchesStatus = statusFilter === '' ||
                              (statusFilter === 'PAGOS' && user.STATUS) ||
                              (statusFilter === 'NÃO PAGOS' && !user.STATUS);
        const matchesDataInicial = dataInicialCompraFilter === '' ||
                                   (user.PURCHASEDATE && user.PURCHASEDATE >= dataInicialCompraFilter);
        const matchesDataFinal = dataFinalCompraFilter === '' ||
                                 (user.PURCHASEDATE && user.PURCHASEDATE <= dataFinalCompraFilter);
        return matchesSearch && matchesStatus && matchesDataInicial && matchesDataFinal;
    });

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };
    const handleStatusChange = (e) => {
        setStatusFilter(e.target.value);
    };
    const handleDataInicialChange = (e) => {
        setDataInicialCompraFilter(e.target.value);
    };
    const handleDataFinalChange = (e) => {
        setDataFinalCompraFilter(e.target.value);
    };

    useEffect(() => {
        let sum = 0;
        let sum2 = 0;
        let sum3 = 0;
        filteredClients.forEach(user => {
            if (user.STATUS) {
                sum += user.TOTALSPENT;
                sum2 += ((user.TOTALSPENT*taxa) + user.TOTALSPENT)
                sum3 += user.COINS;
            }
        });
        setTotal(sum);
        setTotalTaxa(sum2);
        setTotalCOINS(sum3);
    }, [filteredClients]);


    return (
        <ContratosContainer>
            <HomeInitialContent>
                <PartTitle>Painel do Investidor - Modelo de Sistema</PartTitle>
                <Boxes>
                    <Box bgColor="#f2f2f2">
                        <BoxContent>
                            <BoxTitle>VALOR TOTAL</BoxTitle>
                            <span>$ {formatNumber(total)}</span>
                        </BoxContent>
                    </Box>
                    <Box bgColor="#f2f2f2">
                        <BoxContent>
                            <BoxTitle>VALOR TOTAL COM TAXA</BoxTitle>
                            <span>$ {formatNumber(totalTaxa)}</span>
                        </BoxContent>
                    </Box>
                    <Box bgColor="#f2f2f2">
                        <BoxContent>
                            <BoxTitle>QUANTIDADE TOTAL DE TOKENS</BoxTitle>
                            <span>{ parseInt(totalCOINS)}</span>
                        </BoxContent>
                    </Box>
                    <Box bgColor="#f2f2f2">
                        <BoxContent>
                            <BoxTitle>TOTAL DE GANHOS</BoxTitle>
                            <span>R$ 1.536.841,27</span>
                        </BoxContent>
                    </Box>
                </Boxes>
            </HomeInitialContent>

            <Contracts>
                <ContractsTitle>CONTRATOS</ContractsTitle>
                <SearchAreaContent>
                    <SearchArea>
                        <FilterDiv>
                            <h4>STATUS</h4>
                            <select onChange={handleStatusChange}>
                                <option value="">TODOS</option>
                                <option value="PAGOS">PAGOS</option>
                                <option value="NÃO PAGOS">NÃO PAGOS</option>
                            </select>
                        </FilterDiv>

                        <FilterDiv>
                            <h4>DATA INICIAL DA COMPRA</h4>
                            <input type="date" onChange={handleDataInicialChange} />
                        </FilterDiv>

                        {/* <FilterDiv>
                            <h4>DATA FINAL DA COMPRA</h4>
                            <input type="date" onChange={handleDataFinalChange} />
                        </FilterDiv> */}
                    </SearchArea>
                    <SecondSearchBar>
                        <input type="text" placeholder="Nome Do Cliente" onChange={handleSearchChange} />
                    </SecondSearchBar>
                </SearchAreaContent>
            </Contracts>

            <TableContainer>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHeaderCell>ID</TableHeaderCell>
                            <TableHeaderCell>CLIENTE</TableHeaderCell>
                            <TableHeaderCell>DATA DE COMPRA</TableHeaderCell>
                            <TableHeaderCell>QUANTIDADE COINS</TableHeaderCell>
                            <TableHeaderCell>VALOR UNI.</TableHeaderCell>
                            <TableHeaderCell>VALOR TOTAL</TableHeaderCell>
                            <TableHeaderCell>TOTAL + TAXA</TableHeaderCell>
                            <TableHeaderCell>TOTAL GANHO</TableHeaderCell>
                            {/* <TableHeaderCell>RENDENDO ATÉ</TableHeaderCell> */}
                            <TableHeaderCell>STATUS</TableHeaderCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredClients.map((user, index) => (
                            <TableRow key={index}>
                                <TableCell>{user.IDCOMPRA}</TableCell>
                                <TableCell>{user.NAME}</TableCell>
                                <TableCell>{user.PURCHASEDATE}</TableCell>
                                <TableCell>{user.COINS}</TableCell>
                                <TableCell>$ {user.COINVALUE}</TableCell>
                                <TableCell>$ {formatNumber(user.TOTALSPENT)}</TableCell>
                                <TableCell>$ {formatNumber(user.TOTALSPENT) + 50}</TableCell>
                                <TableCell>$ {formatNumber((user.COINS * coinAtualPrice) - user.TOTALSPENT)}</TableCell>
                                {/* <TableCell>00/00/0000</TableCell> */}
                                <TableCell>{user.STATUS ? 'ACEITO' : 'NEGADO'}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

        </ContratosContainer>
    );
}


const ContratosContainer = styled.div`
    width: 100%;
    // background: linear-gradient(to bottom, rgba(228, 244, 250, 1), white,
    // rgba(255, 213, 235, 1), rgba(152, 213, 235, 1));
    background-color: #393e46;
    min-height: 100vh;
    padding: 40px;
    display: flex;
    justify-content: start;
    box-sizing: border-box;
    flex-direction: column;

    @media (max-width: 915px){
        padding-left: 30px;
    }
`;

const HomeInitialContent = styled.div`
    width: 100%;
    height: max-content;
    box-sizing: border-box;
    padding: 20px 20px 20px 20px;

    display: flex;
    flex-direction: column;
    align-items: start;
   
    position: relative;


`;

const PartTitle = styled.div`
    color: #f96d00;
    font-weight: 600;
    font-size: 18px;

    @media (max-width: 915px){
        width: 100%;
        text-align: center;
    }
`;

const Boxes = styled.div`
    width: 100%;
    display: flex;
    gap: 20px;
    position: absolute;
    top: 70px;
    left: 0;
    @media (max-width: 915px){
        gap: 10px;
        top: 20px;
        flex-wrap: wrap;
        position: relative;
        justify-content: center;
    }
`;

const Box = styled.div`
    width: 100%;
    height: 50px;
    border: 1px solid rgba(0,0,0,0.1);
    // background-color: #F7F7F7;
    background-color: ${({ bgColor }) => bgColor || "#F7F7F7"};

    box-shadow: -2px 2px 2px rgba(0, 0, 0, 0.2);
    transition: .4s;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: start;
    
    &:hover{
        height: 100px;
    }

    @media (max-width: 915px){
        width: 300px;
        justify-content: center;
        height: 100px;
    }
`;

const BoxContent = styled.div`
    width: 100%;
    height: max-content;
    display: flex;
    flex-direction: column;
    align-items:center;
    margin-top: 15px;
    gap: 20px;

    @media (max-width: 915px){
        align-items: center;
        margin-top: 0;
        gap: 10px;
    }

`;

const BoxTitle = styled.p`
    margin:0;
    padding:0;
    font-weight: 600;
    color: rgba(0,0,0,0.6);
`;

const Contracts = styled.div`
    width: 100%;
    height: 300px;
    margin-top: 100px;
    
    @media (max-width: 915px){
        margin-top: 40px;
    }
`;

const ContractsTitle = styled.h1`
    width: 100%;
    display: flex;
    color: #f96d00;
    justify-content: center;
    padding-bottom: 20px;
    border-bottom: 2px solid #f96d00;
`;

const SearchAreaContent = styled.div`
    width: 100%;
    border: 1px solid rgba(0,0,0,0.1);
    // background-color: ${({ bgColor }) => bgColor || "#F7F7F7"};

    background-color: #222831;
    box-shadow: -2px 2px 2px rgba(0, 0, 0, 0.2);

    @media (max-width: 915px){
        border: 1px solid rgba(0,0,0,0);
        box-shadow: -2px 2px 2px rgba(0, 0, 0, 0);
        background-color: transparent;
    }
`;

const SearchArea = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: 0px 40px;
    box-sizing: border-box;

    @media (max-width: 915px){
        flex-direction: column;
        padding: 0px 20px;
    }
`;

const FilterDiv = styled.div`
    width:100%;   
    padding: 10px 50px;
    box-sizing: border-box;

    h4{
        color: #f2f2f2;
    }

    select, input{
        width: 100%;
        height: 30px;
        border: 0;
        background-color: #F7F7F7;
        border: 1px solid rgba(0,0,0,0.1);
        color: rgba(0,0,0,0.7);
        padding-left: 20px;
        box-sizing: border-box;
        font-size: 16px;
        box-shadow: -2px 2px 2px rgba(0, 0, 0, 0.2);
    }

    @media (max-width: 915px){
        padding: 10px 20px;

        h4{
            margin-top: 10px;
            margin: 0;
        }

        select, input{
            height: 40px;
        }
    }
`;

const SecondSearchBar = styled.div`
    width: 100%;
    box-sizing: border-box;
    display:flex;
    justify-content:center;
    align-items:center;
    margin-top: 10px;
    padding: 0px 20px 40px 20px;

    input{
        width: 100%;
        height: 30px;
        border: 0;
        box-sizing: border-box;
        border-radius: 8px;  
        text-align: center;     
        background-color: #F7F7F7;
        border: 1px solid rgba(0,0,0,0.1);
        box-shadow: -2px 2px 2px rgba(0, 0, 0, 0.2);
        font-size: 18px;
    }

    @media (max-width: 915px){
        justify-content:center;
        align-items:center;
        margin-top: 10px;
        padding: 0px 40px 40px 40px;

        input{
            border-radius: 2px;  
            height: 40px;
        }
    }
`;

const TableContainer = styled.div`
    margin-top: 40px;
    width: 100%;
    overflow-y: scroll; 
    overflow-x: hidden; 
    max-height: 400px; 
    box-sizing: border-box;
    display: flex;
    box-shadow: 6px 6px 5px rgba(0,0,0,0.6);
    
    @media (max-width: 915px){
        margin-top: 150px;
        overflow-x: scroll; 
        border: 2px solid rgba(0,0,0,0.1);
        padding: 0;
        border-radius: 12px;
    }
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
    background-color: #393e46;
    color: #f2f2f2;
    &:nth-child(even) {
        color: #222831;
        background-color: rgba(57, 62, 70, 0.8);
    }
`;

const TableHeaderCell = styled.th`
    padding: 15px; /* Ajuste o padding conforme necessário */
    text-align: center; /* Ajuste o alinhamento conforme necessário */
    color: #f2f2f2;
    background-color: #222831;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
`;

const TableBody = styled.tbody`
    background-color: white;
`;

const TableCell = styled.td`
    padding: 15px; /* Ajuste o padding conforme necessário */
    text-align: center; /* Ajuste o alinhamento conforme necessário */
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);

    &:hover{
        background-color: black;
        cursor: pointer;
        color: white;
        transform: scale(1.1);
    }
`;