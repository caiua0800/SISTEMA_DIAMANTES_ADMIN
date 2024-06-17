import React from "react";
import styled from "styled-components";

export default function Home() {
    return (
        <HomeContainer>
            <HomeContent>
                <HomeOptions>
                    <Option color="rgba(16, 162, 222, 1)">Option 1</Option>
                    <Option color="rgba(3, 76, 106, 1)">Option 2</Option>
                    <Option color="rgba(18, 202, 30, 1)">Option 3</Option>
                    <Option color="rgba(60, 26, 229, 1)">Option 4</Option>
                    <Option color="rgba(26, 229, 212, 1)">Option 5</Option>
                    <Option color="rgba(104, 8, 40, 1)">Option 6</Option>
                    <Option color="rgba(143, 73, 232, 1)">Option 6</Option>
                </HomeOptions>
            </HomeContent>
        </HomeContainer>
    );
}

const HomeContainer = styled.div`
    width: 100%;
    background-color: rgba(228, 244, 250, 1);
    height: 100vh;
    overflow-y: scroll;
    padding-left: 120px;
    padding-top: 40px;
    display: flex;
    justify-content: start;
    box-sizing: border-box;
`;

const HomeContent = styled.div`
    box-sizing: border-box;
    width: 100%;
    height: 100%;
`;

const HomeOptions = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: start;
    gap: 10px;
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

    &:hover{
        transform: scale(1.05);
    }
`;
