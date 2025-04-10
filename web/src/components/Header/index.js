import logoBranca from "../../assets/Logo_Branca_Normal.png";
import { Button } from 'rsuite';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signOut } from '../../store/modules/auth/actions'; // você deve ter essa action
import ExitIcon from '@rsuite/icons/Exit';

const Header = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { signed } = useSelector(state => state.auth);  // se estiver logado =>

    const handleLogout = () => {
        localStorage.removeItem('userRole'); // limpa o role
        dispatch(signOut()); // limpa o estado do Redux
        navigate('/login'); // redireciona para o login
    };

    return (
        <header className="container-fluid d-flex justify-content-between align-items-center p-2">
            <img 
                src={logoBranca} 
                id="logo" 
                className="img-fluid mx-auto" 
                alt="Logo Adriano Hair Design"
            />
            { signed && (
            <Button appearance="ghost" color="red" onClick={handleLogout}>
                <span className="px-2">Sair</span>
                <ExitIcon></ExitIcon>
            </Button>
            )}
        </header>
    );
};

export default Header;
