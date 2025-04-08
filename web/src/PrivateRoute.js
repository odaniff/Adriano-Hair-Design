import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const { signed } = useSelector(state => state.auth);  // se estiver logado =>

  if (!signed) {
    return <Navigate to="/login" replace />;  //se não tiver redireciona para o login
  }

  return children; // => DIRECIONA a rota requisitada
};

export default PrivateRoute;
