import logoBranca from "../../assets/Logo_Branca_Normal.png";
import { Link, useLocation } from "react-router-dom";

// O location é uma propriedade que contém informações sobre a URL atual, como o caminho, a consulta e o hash. 
// Isso é útil para determinar qual link deve ser destacado como ativo no menu lateral.
const Sidebar = () => {
    // useLocation é um hook do React Router que retorna o objeto de localização atual
    // Que fornece as propriedades de navegação do Router para o componente Sidebar
    const location = useLocation();
    
    const role = localStorage.getItem('userRole');

    
    return (
        <sidebar className="col-2 h-100">
            <img src={logoBranca} className="img-fluid px-3 py-4" alt="Logo"/>
            <ul className='p-0 m-0'>
                <li>
                    <Link to="/agendamentos" className={location.pathname === "/agendamentos" ? "active" : ""}>
                    <span className="mdi mdi-calendar-check"></span>
                    <text>Agendamentos</text>
                    </Link>
                </li>
                <li>
                    <Link to="/servicos" className={location.pathname === "/servicos" ? "active" : ""}>
                    <span className="mdi mdi-content-cut"></span>
                    <text> Serviços</text>
                    </Link>
                </li>
                
                {role === 'admin' && (  // SÓ RENDERIZA SE O userRole = "admin"
                    <>   
                        
                        <li>
                            <Link to="/clientes" className={location.pathname === "/clientes" ? "active" : ""}>
                            <span className="mdi mdi-account-multiple"></span>
                            <text>Clientes</text>
                            </Link>
                        </li>
                        <li>
                            <Link to="/horarios" className={location.pathname === "/horarios" ? "active" : ""}>
                            <span className="mdi mdi-clock-check-outline"></span>
                            <text>Horários</text>
                            </Link>
                        </li>
                        <li>
                            <Link to="/dashboard/agendamentos" className={location.pathname === "/dashboard/agendamentos" ? "active" : ""}>
                            <span class="mdi mdi-monitor-dashboard"></span>
                            <text>Dashboard Agendamentos</text>
                            </Link>
                        </li>
                        <li>
                            <Link to="dashboard/servicos" className={location.pathname === "/dashboard/servicos" ? "active" : ""}>
                            <span class="mdi mdi-monitor-dashboard"></span>
                            <text>Dashboard Serviços</text>
                            </Link>
                        </li>
                    </> 
                )};
            </ul>
        </sidebar>
      );
};

export default Sidebar;