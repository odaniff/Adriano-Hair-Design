import { Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';

import './styles.css';

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Footer from './components/Footer';
import PrivateRoute from './PrivateRoute';

import Agendamentos from "./pages/Agendamentos";
import Clientes from './pages/Clientes';
import Servicos from './pages/Servicos';
import Cadastro from "./pages/Cadastro";
import Login from "./pages/Login";
import Horarios from './pages/Horarios';
import DashboardAgendamentos from './pages/Dashboard_Agendamentos';
import DashboardServicos from './pages/Dashboard_Servicos';

const Rotas = () => {
    const { signed } = useSelector(state => state.auth);

    return (
        <div className="app-container">
            <div className='separarHeader'>
                <Header />
            </div>
            <div className="main-content">
                
                {signed && <Sidebar />}
                <div className="content-wrapper">
                    <main className="page-content">
                        <Routes>
                            
                            <Route path="/" element={<Cadastro />} />
                            <Route path="/login" element={<Login />} />

                            <Route
                                path="/agendamentos"
                                element={
                                    <PrivateRoute> 
                                        <Agendamentos />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/clientes"
                                element={
                                    <PrivateRoute>
                                        <Clientes />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/servicos"
                                element={
                                    <PrivateRoute>
                                        <Servicos />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/horarios"
                                element={
                                    <PrivateRoute>
                                        <Horarios />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="dashboard/agendamentos"
                                element={
                                    <PrivateRoute> 
                                        <DashboardAgendamentos />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="dashboard/servicos"
                                element={
                                    <PrivateRoute> 
                                        <DashboardServicos />
                                    </PrivateRoute>
                                }
                            />

                        </Routes>
                    </main>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Rotas;