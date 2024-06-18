import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SideBar from './Components/SideBar';
import Home from './Components/Home';
import Clients from './Components/Clients';
import Users from './Components/Users';
import Contratos from './Components/Contratos';
import Depositos from './Components/Depositos';


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
  return (
    <Router>
      <div className="App">
        <SideBar NAV_LINKS={NAV_LINKS} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/clientes" element={<Clients />} />
          <Route path="/usuarios" element={<Users />} />
          <Route path="/contratos" element={<Contratos />} />
          <Route path="/depositos" element={<Depositos />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
