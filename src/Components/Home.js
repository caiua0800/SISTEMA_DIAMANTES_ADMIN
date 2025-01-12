import React from "react";
import styled from "styled-components";
import TradingViewWidget from './TeatherGrapth';
import { Link } from 'react-router-dom';

export default function Home() {
    return (
        <HomeContainer>
            <HomeContent>
                <HomeOptions>
                    <StyledLink to="/depositos">
                        <Option color="#FFC300">VALIDAR DEPOSITOS</Option>
                    </StyledLink>                    
                    <StyledLink to="/">
                        <Option color="#219ebc">HOME</Option>
                    </StyledLink>
                    <StyledLink to="/clientes">
                        <Option color="#FFC300">CLIENTES</Option>
                    </StyledLink>
                    <StyledLink to="/usuarios">
                        <Option color="#219ebc">USUÁRIOS</Option>
                    </StyledLink>
                    <StyledLink to="/contratos">
                        <Option color="#FFC300">CONTRATOS</Option>
                    </StyledLink>
                    <StyledLink to="/saques">
                        <Option color="#219ebc">VALIDAR SAQUES</Option>
                    </StyledLink>
                    <StyledLink to="/saquesFeitos">
                        <Option color="#219ebc">OPERAÇÕES DE SAQUES</Option>
                    </StyledLink>
                    {/* <StyledLink to="/configuracoes">
                        <Option color="#FFC300">CONFIGURAÇÕES</Option>
                    </StyledLink> */}
                    <StyledLink to="/validacao">
                        <Option color="#FFC300">VALIDAÇÃO DE DOCUMENTOS</Option>
                    </StyledLink>
                    <StyledLink to="/noticias">
                        <Option color="#219ebc">NOTÍCIAS</Option>
                    </StyledLink>
                    <StyledLink to="/rendimentos">
                        <Option color="#219ebc">RODAR RENDIMENTO DIÁRIO</Option>
                    </StyledLink>
                </HomeOptions>

                <GrapthContainer>
                    <TradingViewWidget />
                </GrapthContainer>
            </HomeContent>
        </HomeContainer>
    );
}

const HomeContainer = styled.div`
    width: 100%;
    background: linear-gradient(to right, #001D3D, #003566, #001D3D);
    height: 100vh;
    overflow-y: scroll;
    padding-top: 40px;
    display: flex;
    justify-content: center;
    align-items: start;
    box-sizing: border-box;
    overflow-x: hidden;
    @media (max-width: 920px){
        padding: 80px 20px;
    }
`;

const HomeContent = styled.div`
    box-sizing: border-box;
    width: 100%;
    display: flex;
    justify-content: center;
    flex-direction: column;
`;

const GrapthContainer = styled.div`
    padding: 40px 30px;
    box-sizing: border-box;
    width: 100%;
    height: 600px;
    overflw: hidden;
    display: flex;
    justify-content: center;

    @media (max-width: 920px){
        margin-top: 20px;
        padding: 0px;
        height: 450px;

    }
`;

const HomeOptions = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    width: 100%;
    gap: 10px;

    @media (max-width: 920px){
        flex-wrap: no-wrap; 
        flex-direction: column; 
    }
`;

const Option = styled.div`
    width: 500px;
    height: 100px;
    box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.6);
    background-color: ${(props) => props.color || "white"};
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 22px;
    transition: .3s;
    color: rgba(0,0,0,0.7);
    font-weight: 600;
    &:hover{
        transform: scale(1.05);
    }

    @media (max-width: 920px){
        width: 100%;
    }
`;

const StyledLink = styled(Link)`
    text-decoration: none;
    color: inherit;
`;
