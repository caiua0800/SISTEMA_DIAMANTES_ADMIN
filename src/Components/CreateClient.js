import React, { useState } from "react";
import styled from "styled-components";
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function SignUpPage() {
    const [cpf, setCpf] = useState('');
    const [phone, setPhone] = useState('+55 ');
    const [profilePicture, setProfilePicture] = useState(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [name, setName] = useState("");
    const [adress, setAdress] = useState("");
    const [neighborhood, setNeighborhood] = useState("");
    const [cep, setCep] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");

    const formatCpf = (value) => {
        value = value.replace(/\D/g, '');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        return value;
    };

    const handleCpfChange = (event) => {
        const value = event.target.value;
        setCpf(formatCpf(value));
    };

    const formatPhone = (value) => {
        value = value.replace(/\D/g, '');
        value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
        value = value.replace(/(\d{5})(\d{4})$/, '$1-$2');
        return value;
    };

    const handlePhoneChange = (event) => {
        let value = event.target.value.replace('+55 ', '');
        if (value.length <= 14) {
            value = formatPhone(value);
            setPhone('+55 ' + value);
        }
    };

    const handlePhoneFocus = () => {
        if (phone === '') {
            setPhone('+55 ');
        }
    };

    const handleProfilePictureChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePicture(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const firebaseConfig = {
        apiKey: 'AIzaSyCnwSOjrqasUNSCp6UrK2moHd1OtLUMj28',
        authDomain: 'wldata.firebaseapp.com',
        projectId: 'wldata',
        storageBucket: 'wldata.appspot.com',
        messagingSenderId: '86184173654',
        appId: '1:86184173654:web:9463c36b71d142b684dbf7'
    };

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const storage = getStorage(app);

    const handleSignUp = async () => {
        if (email !== '' && password !== '' && password2 !== '' && name !== '' &&
             phone !== '' && adress != "" && neighborhood != "" && cep != "" && city != ""
             && state != "") {
            if (password !== password2) {
                alert("As senhas não coincidem!");
                return;
            }

            try {
                // Cria o usuário no Firebase Authentication
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                console.log('Usuário criado com sucesso!', user);

                // Upload da foto de perfil
                // const storageRef = ref(storage, 'Profile-Pictures/' + cpf.replace(/\D/g, ''));
                // const metadata = {
                //     contentType: 'image/jpeg' // ajuste conforme necessário para o tipo de arquivo da imagem
                // };
                // await uploadBytes(storageRef, profilePicture, metadata);

                // // Obter a URL da foto de perfil após o upload
                // const downloadURL = await getDownloadURL(storageRef);
                // console.log('URL da foto de perfil:', downloadURL);

                // Salvar os dados do usuário no Firestore
                const firestore = getFirestore();
                const userRef = doc(firestore, 'USERS', cpf.replace(/\D/g, ''));
                await setDoc(userRef, {
                    NAME: name.toUpperCase(),
                    EMAIL: email,
                    CPF: cpf.replace(/\D/g, ''),
                    PROFILE_PICTURE_URL: 'downloadURL',
                    ADRESS: adress.toUpperCase(),
                    NEIGHBORHOOD: neighborhood.toUpperCase(),
                    POSTALCODE: cep,
                    CITY: city.toUpperCase(),
                    STATE: state.toUpperCase(),
                    CONTACT: phone,
                    INDICATIONBUDGET: 0
                });
                console.log('Documento criado com sucesso com o ID:', cpf);

                alert('Usuário cadastrado com sucesso!');
                window.location.href = '/clientes'

            } catch (error) {
                console.error('Erro ao cadastrar usuário:', error.message);
                alert('Erro ao cadastrar usuário: ' + error.message);
            }
        } else {
            alert("Preencha todos os campos");
        }
    };

    return (
        <SignUpContainer>
            <ContainerContent>
                <SingUpBox>
                    <h1>FAÇA SEU CADASTRO E SEJA UM INVESTIDOR EM NOSSA PLATAFORMA</h1>

                    <PerfilPictureArea>
                        <Picture>
                            {profilePicture ? <img src={profilePicture} alt="Perfil" /> : <Placeholder />}
                            <input type="file" accept="image/*" onChange={handleProfilePictureChange} />
                        </Picture>
                        Foto de Perfil
                    </PerfilPictureArea>

                    <Form>
                        <FormGroup>
                            <h2>Nome Completo</h2>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </FormGroup>
                        <FormGroup>
                            <h2>CPF</h2>
                            <input
                                type="text"
                                value={cpf}
                                onChange={handleCpfChange}
                                maxLength="14" // Máximo de caracteres no formato 000.000.000-00
                            />
                        </FormGroup>
                        <FormGroup>
                            <h2>EMAIL</h2>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </FormGroup>
                        <FormGroup>
                            <h2>CONTATO (WHATSAPP)</h2>
                            <input
                                type="tel"
                                value={phone}
                                onChange={handlePhoneChange}
                                onFocus={handlePhoneFocus}
                                maxLength="19" // Máximo de caracteres no formato +55 (99) 99999-9999
                            />
                        </FormGroup>

                        <FormGroup>
                            <h2>ENDEREÇO</h2>
                            <input
                                type="tel"
                                value={adress}
                                onChange={(e) => setAdress(e.target.value)}
                            />
                        </FormGroup>

                        <FormGroup>
                            <h2>BAIRRO</h2>
                            <input
                                type="tel"
                                value={neighborhood}
                                onChange={(e) => setNeighborhood(e.target.value)}
                            />
                        </FormGroup>

                        <FormGroup>
                            <h2>CEP</h2>
                            <input
                                type="tel"
                                value={cep}
                                onChange={(e) => setCep(e.target.value)}
                            />
                        </FormGroup>

                        <FormGroup>
                            <h2>CIDADE</h2>
                            <input
                                type="tel"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                            />
                        </FormGroup>
                        
                        <FormGroup>
                            <h2>ESTADO</h2>
                            <input
                                type="tel"
                                value={state}
                                onChange={(e) => setState(e.target.value)}
                            />
                        </FormGroup>

                        <FormGroupPass>
                            <h2>Crie Sua Senha</h2>
                            <div>
                                <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Digite A Senha" />
                                <input value={password2} onChange={(e) => setPassword2(e.target.value)} type="password" placeholder="Repita A Senha" />
                            </div>
                        </FormGroupPass>
                    </Form>
                    <button onClick={handleSignUp}>FINALIZAR CADASTRO</button>
                </SingUpBox>
            </ContainerContent>
        </SignUpContainer>
    );
}

const SignUpContainer = styled.div`
    width: 100%;
    background-color: #202020;
    min-height: 100vh;
    height: max-content;
    display: flex;
    justify-content: center;
    box-sizing: border-box;
    align-items: center;
`;

const ContainerContent = styled.div`
    width: 550px;
    height: max-content;
    box-sizing: border-box;
    padding: 20px 40px;
    text-align: center;

    button{
        width: 100%;
        height: 40px;
        border: 0;
        background-color: #10db22;
        border-radius: 12px;
        transition: .3s;
        font-weight: 600;
        margin-top: 20px;
        &:hover{
            background-color: #09ff1e;
        }
    }

    @media (max-width: 800px){
        padding: 20px 10px;
    }
`;

const SingUpBox = styled.div`
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 20px;
    box-shadow: 2px 3px 3px rgb(0, 0, 0, 0.6);
    display: flex;
    flex-direction: column;
    padding: 40px;
    box-sizing: border-box;

    h1{
        color: #faad0e;
        cursor: pointer;
        font-size: 18px;
        transition: .3s;
        margin-top: 20px;
        &:hover{
            color: #faad0e;
            text-shadow: 1px 1px 10px rgba(255,255,255,0.6);
        }
    }

    @media (max-width: 800px){
        padding: 20px;

        h1{
            font-size: 18px;
            width: 100%;
            text-align: center;
        }
    }
`;

const PerfilPictureArea = styled.div`
    width: 100%;
    height: max-content;
    margin: 10px 0;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    color: rgba(255,255,255, 0.6);
    gap: 10px;
`;

const Picture = styled.div`
    width: 180px;
    height: 180px;
    border-radius: 50%;
    border: 4px solid #202020;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    box-shadow: 5px 5px 4px rgba(0,0,0,0.6);

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 50%;
    }

    input {
        position: absolute;
        width: 100%;
        height: 100%;
        opacity: 0;
        cursor: pointer;
    }
`;

const Placeholder = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ccc;
    font-size: 16px;
`;

const Form = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
    margin-top: 10px;
    box-sizing: border-box;
    gap: 20px;
`;

const FormGroup = styled.div`
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    flex-direction: column;

    h2{
        color: rgba(255,255,255,1);
        text-shadow: 2px 2px 1px black;
        font-size: 18px;
        margin: 0;
    }

    input{
        width: 300px;
        text-align: center;
        height: 35px;
        border: 0;
        padding-left: 10px;
        box-shadow: 2px 2px 2px rgba(255,255,255,0.2);
        border-radius: 12px;
        background-color: rgba(255,255,255, 1);
    }
`;

const FormGroupPass = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;

    h2{
        color: white;
    }

    div{
        display: flex;
        gap: 20px;
        width: 100%;

        input{
            width: 100%;
            height: 30px;
            border: 0;
            box-shadow: 2px 2px 2px rgba(255,255,255,0.2);
            border-radius: 12px;
            padding-left: 10px;
        }
    }
`;
