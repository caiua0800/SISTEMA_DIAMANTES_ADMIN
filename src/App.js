import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SideBar from './Components/SideBar';
import Home from './Components/Home';
import Clients from './Components/Clients';
import Users from './Components/Users';
import Contratos from './Components/Contratos';
import Depositos from './Components/Depositos';
import Login from './Components/Login';
import { useDispatch, useSelector } from 'react-redux';
import { Provider } from 'react-redux';
import store from './redux/store'; // Import your Redux store
import { useEffect } from 'react';
import { loginUser } from './redux/actions';
import SignUpPage from './Components/CreateClient';
import Saques from './Components/Saques';
import Validacao from './Components/Validacao';
import CreateNews from './Components/CreateNews';
import Rendimentos from './Components/Rendimentos';
import SaquesFeitos from './Components/SaquesFeitos';

const NAV_LINKS = [
  { name: "Home", path: "/" },
  { name: "Usuários", path: "/usuarios" },
  { name: "Clientes", path: "/clientes" },
  { name: "Contratos", path: "/contratos" },
  { name: "Validar Depósitos", path: "/depositos" },
  { name: "Validar Saques", path: "/saques" },
  { name: "Saques Feitos", path: "/saquesFeitos" },
  { name: "Validação Doc.", path: "/validacao" },
  { name: "Notícias", path: "/noticias" },
  { name: "Rendimentos", path: "/rendimentos" }
];

function App() {
  const currentUser = useSelector(state => state.userReducer.currentUser);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!currentUser && localStorage.getItem('user')) {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      dispatch(loginUser(storedUser.EMAIL, storedUser.PASS));
    }
  }, [currentUser, dispatch]);


  return (
    <Router>
      <div className="App">
        {currentUser ? (
          <>
            <SideBar NAV_LINKS={NAV_LINKS} />
            <Routes>
              <Route path="/" element={<Home />} />
              {/* <Route path="/home" element={<Home />} /> */}
              <Route path="/clientes" element={<Clients />} />
              <Route path="/usuarios" element={<Users />} />
              <Route path="/contratos" element={<Contratos />} />
              <Route path="/depositos" element={<Depositos />} />
              <Route path="/noticias" element={<CreateNews />} />
              <Route path="/criarcliente" element={<SignUpPage />} />
              <Route path="/saques" element={<Saques />} />
              <Route path="/validacao" element={<Validacao />} />
              <Route path="/rendimentos" element={<Rendimentos />} />
              <Route path="/saquesFeitos" element={<SaquesFeitos />} />
            </Routes>
          </>
        ) : (
          <Routes>
            <Route path="/" element={<Login />} />
          </Routes>
        )}
      </div>
    </Router>
  );
}

function Root() {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}

export default Root;
