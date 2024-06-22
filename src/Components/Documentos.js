import React, { useState } from "react";
import styled from "styled-components";
import { storage } from "../DATABASE/firebaseConfig"; // Importe o storage corretamente

export default function Documentos() {
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setFile(e.target.files[0]); 
        }
    };

    const handleUpload = () => {
        if (file) {
            const storageRef = storage.ref(); 
            const fileRef = storageRef.child("DOCUMENTODOWNLOAD");

            fileRef.put(file).then(() => {
                console.log("Arquivo enviado com sucesso!");
            }).catch((error) => {
                console.error("Erro ao enviar o arquivo:", error);
            });
        } else {
            console.error("Nenhum arquivo selecionado!");
        }
    };

    return (
        <DocumentosContainer>
            <div>
                <span>SELECIONE O DOCUMENTO</span>
                <input type="file" onChange={handleFileChange} />
                <button onClick={handleUpload}>ENVIAR</button>
            </div>
        </DocumentosContainer>
    );
}

const DocumentosContainer = styled.div`
    width: 100%;
    background-color: #393e46;
    min-height: 100vh;
    padding: 40px;
    display: flex;
    justify-content: center;
    box-sizing: border-box;
    flex-direction: column;

    @media (max-width: 915px) {
        padding-left: 30px;
    }

    div {
        display: flex;
        width: 100%;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        gap: 10px;

        span {
            font-size: 26px;
        }

        input[type="file"] {
            width: 300px;
            font-size: 16px;
        }

        button {
            width: 300px;
            margin-top: 10px;
            height: 30px;
            cursor: pointer;
        }
    }
`;
