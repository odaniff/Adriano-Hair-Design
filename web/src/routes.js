import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import './styles.css';

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

import Agendamentos from "./pages/Agendamentos";
import Clientes from './pages/Clientes';
import Servicos from './pages/Servicos';
import Cadastro from "./pages/Cadastro"

const Rotas = () => {
    const location = useLocation();
    const hiddenSidebarRoutes = ['/', '/login'];  // rotas para esconder o Sidebar
    const isLoginPage = hiddenSidebarRoutes.includes(location.pathname);

    return (
        <>
            <Header />
            <div className="container-fluid h-100">
                <div className="row h-100">
                    {/* Renderiza o Sidebar só se não estiver na página de login */}
                    {!isLoginPage && <Sidebar />}


                        <Routes>
                            <Route path="/" element={<Cadastro/>} />   
                            <Route path="/agendamentos" element={<Agendamentos/>} />
                            <Route path="/clientes" element={<Clientes/>} />
                            <Route path="/servicos" element={<Servicos/>} />
                        </Routes>


                </div>
            </div>
        </>
    ); 
};

export default Rotas;