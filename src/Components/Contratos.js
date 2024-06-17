import React from "react";
import styled from "styled-components";

export default function Contratos() {

    return (
        <ContratosContainer>
            
            <HomeInitialContent>
                <PartTitle>Painel do Investidor - Modelo de Sistema</PartTitle>

                <Boxes>
                    <Box>
                        s
                    </Box>
                    <Box>
                        s
                    </Box>
                    <Box>
                        s
                    </Box>
                    <Box>
                        s
                    </Box>
                </Boxes>
            </HomeInitialContent>

        </ContratosContainer>
    )
}

const ContratosContainer = styled.div`
    width: 100%;
    background-color: rgba(228, 244, 250, 1);
    height: 100vh;
    overflow-y: scroll;
    padding-left: 120px;
    padding-right: 40px;
    padding-top: 40px;
    display: flex;
    justify-content: start;
    box-sizing: border-box;
`;

const HomeInitialContent = styled.div`
    width: 100%;
    height: max-content;
    box-sizing: border-box;
    padding: 20px 20px 20px 20px;

    display: flex;
    flex-direction: column;
    align-items: start;
    gap: 50px;
`;

const PartTitle = styled.div`
    color: rgba(0,0,0,0.7);
    font-weight: 600;
    font-size: 18px;
`;

const Boxes = styled.div`
    width: 100%;
    display: flex;
    gap: 20px;
`;

const Box = styled.div`
    width: 100%;
    background-color: black;
`;