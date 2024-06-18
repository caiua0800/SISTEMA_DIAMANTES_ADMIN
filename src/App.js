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

const NAV_LINKS = [
  { name: "Home", path: "/home" },
  { name: "Usuários", path: "/usuarios" },
  { name: "Clientes", path: "/clientes" },
  { name: "Contratos", path: "/contratos" },
  { name: "Depósitos", path: "/depositos" },
  { name: "Saques", path: "/saques" },
  { name: "Configurações", path: "/configuracoes" },
  { name: "Documentos", path: "/documentos" },
  { name: "Notícias", path: "/noticias" }
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

  console.log(currentUser);

  return (
    <Router>
      <div className="App">
        {currentUser ? (
          <>
            <SideBar NAV_LINKS={NAV_LINKS} />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/clientes" element={<Clients />} />
              <Route path="/usuarios" element={<Users />} />
              <Route path="/contratos" element={<Contratos />} />
              <Route path="/depositos" element={<Depositos />} />
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
