import React, { useState } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from 'react-redux';
import rootReducer from "../redux/root-reducer";
import userActionTypes from "../redux/user/action-types";
import { loginUser } from '../redux/actions';
import Loading from "./Loader";

export default function Login() {

    const { currentUser } = useSelector(rootReducer => rootReducer.userReducer);
    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [load, setLoad] = useState(false)

    const handleLoginClick = () => {
        dispatch(loginUser(email, pass, setLoad));
    }


    return (
        <LoginContainer>
            <Loading load={load} />
            <LoginCenter>

                <Initial>ADMIN PLATFORM</Initial>

                <Formu>
                    <FormuGroup>
                        <p>USUÁRIO</p>
                        <input 
                            placeholder="email"
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                    </FormuGroup>
                    <FormuGroup>
                        <p>SENHA</p>
                        <input 
                            type="password"
                            placeholder="senha"
                            onChange={e => setPass(e.target.value)}
                            value={pass}
                        />
                    </FormuGroup>
                </Formu>

                <Logar onClick={handleLoginClick}>ENTRAR</Logar>
            </LoginCenter>
        </LoginContainer>
    )
}

const LoginContainer = styled.div`
    width: 100%;
    height: 100vh;
    overflow:hidden;
    box-sizing: border-box;
    padding: 40px 0px;
    background-color: #22313f;
    color: #f1f1f1;
    display: flex;
    justify-content: center;
    align-items: center; 
`;

const LoginCenter = styled.div`
    width: max-content;
    padding: 40px;
    box-shadow: 3px 3px 15px rgba(0,0,0,0.6);
`;

const Initial = styled.h1`
    color: #8dc6ff;
    margin: 0;
    margin-bottom: 10px;
`;

const Formu = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const FormuGroup = styled.div`
    display: flex;
    flex-direction: column;

    p{
        margin: 0;
    }

    input{
        height: 30px;
        font-size: 18px;
        padding-left: 15px;
    }
`;

const Logar = styled.button`
    margin-top: 10px;
    width: 100%;
    height: 30px;
    cursor: pointer;
    background-color: #8dc6ff;
    border: 0;
    transition: .3s;

    &:hover{
        background-color: #34495e;
        color: #e4f1fe;
    }
`;