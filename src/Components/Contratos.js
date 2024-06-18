import React from "react";
import styled from "styled-components";

export default function Contratos() {

    return (
        <ContratosContainer>

            <HomeInitialContent>
                <PartTitle>Painel do Investidor - Modelo de Sistema</PartTitle>

                <Boxes>
                    <Box bgColor="#f2f2f2">
                        <BoxContent >
                            <BoxTitle>VALOR TOTAL</BoxTitle>

                            <span>R$ 0000,00000</span>
                        </BoxContent>
                    </Box>
                    <Box bgColor="#f2f2f2">
                        <BoxContent>
                            <BoxTitle>VALOR TOTAL COM TAXA</BoxTitle>
                            <span>R$ 0000,00000</span>

                        </BoxContent>
                    </Box>
                    <Box bgColor="#f2f2f2">
                        <BoxContent>
                            <BoxTitle>QUANTIDADE TODAL DE TOKENS</BoxTitle>
                            <span>R$ 0000,00000</span>

                        </BoxContent>
                    </Box>
                    <Box bgColor="#f2f2f2">
                        <BoxContent>
                            <BoxTitle>TOTAL DE GANHOS</BoxTitle>
                            <span>R$ 0000,00000</span>
                        </BoxContent>
                    </Box>
                </Boxes>
            </HomeInitialContent>

            <Contracts>
                <ContractsTitle>CONTRATOS</ContractsTitle>
                <SearchAreaContent bgColor="rgba(152, 213, 235, 1)">
                    <SearchArea>
                        <FilterDiv>
                            <h4>STATUS</h4>
                            <select>
                                <option>TODOS</option>
                                <option>PAGOS</option>
                                <option>NÃO PAGOS</option>
                            </select>
                        </FilterDiv>

                        <FilterDiv>
                            <h4>DATA INICIAL DA COMPRA</h4>
                            <input type="date" />
                        </FilterDiv>

                        <FilterDiv>
                            <h4>DATA FINAL DA COMPRA</h4>
                            <input type="date" />
                        </FilterDiv>
                    </SearchArea>
                    <SecondSearchBar>
                        <input type="text" placeholder="Nome Do Cliente" />
                    </SecondSearchBar>
                </SearchAreaContent>
            </Contracts>

            <TableContainer>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHeaderCell>ID</TableHeaderCell>
                            <TableHeaderCell>CLIENTE</TableHeaderCell>
                            <TableHeaderCell>DATA COMPRA</TableHeaderCell>
                            <TableHeaderCell>VALOR UNI.</TableHeaderCell>
                            <TableHeaderCell>VALOR TOTAL</TableHeaderCell>
                            <TableHeaderCell>VALOR TOTAL + TAXA</TableHeaderCell>
                            <TableHeaderCell>TOTAL GANHO</TableHeaderCell>
                            <TableHeaderCell>RENDENDO ATÉ</TableHeaderCell>
                            <TableHeaderCell>STATUS</TableHeaderCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {[...Array(50)].map((_, index) => (
                            <TableRow key={index}>
                                <TableCell>Valor {index + 1}</TableCell>
                                <TableCell>Descrição {index + 1}</TableCell>
                                <TableCell>Data {index + 1}</TableCell>
                                <TableCell>Status {index + 1}</TableCell>
                                <TableCell>Cliente {index + 1}</TableCell>
                                <TableCell>Detalhes {index + 1}</TableCell>
                                <TableCell>Ações {index + 1}</TableCell>
                                <TableCell>DATA {index + 1}</TableCell>
                                <TableCell>DATA {index + 1}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

        </ContratosContainer>
    )
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
`;