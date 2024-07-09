import React, { useState } from "react";
import styled from "styled-components";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import firebase from "firebase/compat/app";
import "firebase/compat/storage";
import "firebase/compat/firestore"; 

const firebaseConfig = {
    apiKey: "AIzaSyCnwSOjrqasUNSCp6UrK2moHd1OtLUMj28",
    authDomain: "wldata.firebaseapp.com",
    projectId: "wldata",
    storageBucket: "wldata.appspot.com",
    messagingSenderId: "86184173654",
    appId: "1:86184173654:web:9463c36b71d142b684dbf7"
};

firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();
const firestore = firebase.firestore();

function ModalComponent({ onClose }) {
    const [selectedImage, setSelectedImage] = useState(null);
    const [textAlign, setTextAlign] = useState('left');
    const [fileUploadProgress, setFileUploadProgress] = useState(0);
    const [imageUrl, setImageUrl] = useState(null);
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');


    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setSelectedImage(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleTextAlignChange = (align) => {
        setTextAlign(align);
    };

    const handleUpload = () => {
        if (selectedImage) {
            const randomName = Math.random().toString(36).substring(7);
            const uploadTask = storage.ref(`news/${randomName}`).putString(selectedImage, 'data_url');

            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                    setFileUploadProgress(progress);
                },
                (error) => {
                    console.error(error);
                },
                () => {
                    storage
                        .ref("news")
                        .child(randomName)
                        .getDownloadURL()
                        .then((url) => {
                            saveNewsData(url); // Salva os dados da notícia após obter a URL da imagem
                            console.log("URL do arquivo:", url);
                            setImageUrl(url); // Salva a URL da imagem no estado
                        })
                        .catch((error) => {
                            console.error("Erro ao obter a URL do arquivo:", error);
                        });
                }
            );
        }
    };

    const saveNewsData = (imageUrl) => {
        const date = new Date();
        const formattedDate = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;

        firestore.collection('NEWS').add({
            title: title,
            body: body,
            imageUrl: imageUrl,
            data: formattedDate
        })
            .then((docRef) => {
                console.log("Documento adicionado com ID: ", docRef.id);
                onClose(); // Fecha o modal após salvar os dados
            })
            .catch((error) => {
                console.error("Erro ao adicionar documento: ", error);
            });
    };

    return (
        <ModalComponentContainer id="modal-content">
            <ModalContent>
                <CloseButton onClick={onClose}>X</CloseButton>
                <h6>CRIE UMA NOTÍCIA</h6>

                <NewsBox>
                    <PhotoInputBox>
                        <input type="file" onChange={handleImageChange} />
                        {selectedImage && <img src={selectedImage} alt="Selected" />}
                    </PhotoInputBox>

                    <NewsInfo>
                        <NewsTitle id="news-title">
                            <span>TÍTULO</span>
                            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                        </NewsTitle>

                        <NewsBody id="news-body">
                            <span>BODY</span>
                            <textarea style={{ textAlign: textAlign }} value={body} onChange={(e) => setBody(e.target.value)} />
                            <h4>SELECIONE O ALINHAMENTO</h4>
                            <div>
                                <button className="left" onClick={() => handleTextAlignChange('left')}>À ESQUERDA</button>
                                <button className="center" onClick={() => handleTextAlignChange('center')}>CENTRO</button>
                                <button className="justified" onClick={() => handleTextAlignChange('justify')}>JUSTIFICADA</button>
                                <button className="right" onClick={() => handleTextAlignChange('right')}>À DIREITA</button>
                            </div>
                        </NewsBody>
                    </NewsInfo>

                    <SendNewsBox>
                        <button onClick={handleUpload}>ENVIAR</button>
                        {/* {imageUrl && <button onClick={handleOpenImage}>Abrir Imagem</button>} */}
                    </SendNewsBox>
                </NewsBox>
            </ModalContent>
        </ModalComponentContainer>
    );
}

export default function CreateNews() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    return (
        <CreateNewsContainer>
            <CreateNewsContent>
                <TitleComponent><h1 onClick={handleOpenModal}>CREATE NEWS</h1></TitleComponent>
                {isModalOpen && <ModalComponent onClose={handleCloseModal} />}
            </CreateNewsContent>
        </CreateNewsContainer>
    );
}




const CreateNewsContainer = styled.div`
    width: 100%;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    box-sizing: border-box;
    align-items: center;
    position: relative;
    background: linear-gradient(to right, #001D3D, #003566, #001D3D);
`;

const CreateNewsContent = styled.div`
    width: 100%;
    height: max-content;
    box-sizing: border-box;
    padding: 30px;
`;

const TitleComponent = styled.div`
    width: 100%;
    text-align: center;
    color: rgba(0,0,0,0.6);
    box-sizing: border-box;
    overflow: hidden;

    h1 {
        cursor: pointer;
        transition: .3s;
        box-sizing: border-box;
        position: relative;

        &:hover {
            color: rgba(255, 171, 80, 1);
            transform: scale(1.4);
            animation: glow 1s infinite alternate;
        }
    }
    
    @keyframes glow {
        0% {
            text-shadow: 0 0 1px rgba(255, 171, 80, 0.5), 0 0 10px rgba(255, 171, 80, 0.4), 0 0 15px rgba(255, 171, 80, 0.3), 0 0 20px rgba(255, 171, 80, 0.2);
        }
        100% {
            text-shadow: 0 0 20px rgba(255, 171, 80, 1), 0 0 30px rgba(255, 171, 80, 0.7), 0 0 40px rgba(255, 171, 80, 0.6), 0 0 50px rgba(255, 171, 80, 0.5);
        }
    }
`;

const ModalComponentContainer = styled.div`
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    padding: 40px;

    @media (max-width: 1200px){
        padding: 10px;
    }
`;

const ModalContent = styled.div`
    width: 90%;
    height: 800px;
    overflow-y: scroll;
    overflow-x: hidden;
    border-radius: 3px;
    box-shadow: 2px 2px 3px rgba(0,0,0,0.4);
    background: linear-gradient(to right, #003566, #001D3D, #003566);
    padding: 20px;
    position: relative;

    h6 {
        font-size: 38px;
        margin: 0;
        color: #FFC300;
    }

    @media (max-width: 1200px){
        height: 700px;
        padding: 10px;
    }
`;

const CloseButton = styled.button`
    position: absolute;
    top: 20px;
    left: 20px;
    background: transparent;
    border: none;
    font-size: 24px;
    cursor: pointer;
`;

const NewsBox = styled.div`
    width: 100%;
    box-sizing: border-box;
    margin-top: 40px;

    display: flex;
    flex-direction: column;
    align-items: center;
`;

const PhotoInputBox = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 500px;
    background-color: #001D3D;
    position: relative;
    box-sizing: border-box;
    cursor: pointer;
    transition: .3s;
    border-radius: 8px;

    input {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        cursor: pointer;
    }

    &:hover{
        background-color: rgba(255, 195, 0, 1);
    }

    img {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        max-width: 100%;
        max-height: 100%;
        border-radius: 8px;
    }
`;

const NewsInfo = styled.div`
    margin-top: 30px;
    display: flex;
    width: 100%;
    flex-direction: column;
    box-sizing: border-box;
    gap: 20px;
`;

const NewsTitle = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    box-sizing: border-box;

    span{
        font-size: 28px;
        color: white;
        font-weight: 600;
        text-shadow: 1px 1px 1px rgba(0,0,0,0.5);
        margin-bottom: 5px;
    }

    input{
        box-sizing: border-box;
        width: 100%;
        height: 40px;
        text-align: center;
        border: 1px solid rgba(0,0,0,0.1);
        font-size: 26px;
        color: rgba(0,0,0,0.9);
    }
`;

const NewsBody = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    span{
        font-size: 28px;

        font-weight: 600;
        color: white;
        text-shadow: 1px 1px 1px rgba(0,0,0,0.5);
    }

    textarea{
        box-sizing: border-box;
        width: 100%;
        min-height: 500px;
        height: 40px;
        text-align: start;
        border: 1px solid rgba(0,0,0,0.1);
        font-size: 26px;
        color: rgba(0,0,0,0.9);
    }

    h4{
        margin: 0;
        margin-top: 10px;
        color: white;
        margin-bottom: 10px;
    }

    div{
        display: flex;
        gap: 10px;

        button{
            width: 200px;
            height: 40px;
            cursor: pointer;
            border: 2px solid transparent;
            border-radius: 3px;
            transition: .3s;

            &:hover{
                border: 2px solid black;
                background-color: #001D3D;
                color: white;
            }
        }

        .left, .right{
            background-color:rgba(250, 154, 49, 0.8); 
        }

        .center, .justified{
            background-color: rgba(18, 147, 247, 0.8);
        }

        @media (max-width: 1200px){
            flex-direction: column;
        }

    }
`;

const SendNewsBox = styled.div`
    width: 100%;
    margin-top: 15px;
    padding-bottom: 50px;
    button{
        width: 100%;
        height: 40px;
        background-color: rgba(20, 189, 0, 1);
        color: white;
        font-weight: 600;
        border: 0;
        font-size: 22px;
        cursor:pointer;

        transition: .3s;

        &:hover{
            border: 2px solid black;
            background-color: transparent;
            color: #FFC300;
        }
    }
`;
