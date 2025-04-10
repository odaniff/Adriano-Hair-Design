import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Input, Panel, Message, toaster } from 'rsuite';
import { signInRequest } from '../../store/modules/auth/actions';

const Login = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { signed, loading, error } = useSelector(state => state.auth);
  
  const isAdmin = new URLSearchParams(location.search).get('admin') === 'true'; // profcura se tem ?admin=true ('/login?admin=true')
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  useEffect(() => {
    if (signed) {
      
    // Salva o tipo de usuário no localStorage
    localStorage.setItem('userRole', isAdmin ? 'admin' : 'cliente');  //se for admin o userRole = 'admin'

    // Redireciona para agendamentos
    navigate('/agendamentos');

    }
  }, [signed, isAdmin, navigate]);

  useEffect(() => {
    if (error) {
      toaster.push(
        <Message showIcon type="error" closable>
          {error}
        </Message>,
        { placement: 'topCenter' }
      );
    }
  }, [error]);

  const handleLogin = () => {
    if (!email || !senha) {
      toaster.push(
        <Message showIcon type="warning" closable>
          Preencha todos os campos
        </Message>,
        { placement: 'topCenter' }
      );
      return;
    }
    dispatch(signInRequest(email, senha, isAdmin));
  };

  return (
    <div style={styles.container}>
      <Panel style={styles.panel} bordered shaded>
        <h4 style={styles.title}>{isAdmin ? 'Login Administrador' : 'Login'}</h4>
        
        <Input
          placeholder="Email"
          value={email}
          onChange={setEmail}
          style={styles.input}
        />
        
        <Input
          placeholder="Senha"
          type="password"
          value={senha}
          onChange={setSenha}
          style={styles.input}
        />
        
        <Button 
          appearance="primary" 
          block 
          onClick={handleLogin}
          loading={loading}
          style={styles.button}
        >
          Entrar
        </Button>

        <Button 
          appearance="ghost" 
          block 
          onClick={() => {
            navigate('/login?admin=true')
            }
          }
          style={styles.linkButton}
        >
          Sou Administrador
        </Button>

        <Button 
          appearance="ghost" 
          block 
          onClick={() => {
            navigate('/login')
            }
          }
          style={styles.linkButton}
        >
          Sou Cliente
        </Button>
        
        {!isAdmin && (
          <Button 
            appearance="link" 
            block 
            onClick={() => navigate('/')}
            style={styles.linkButton}
          >
            Não tem conta? Cadastre-se
          </Button>
        )}
        
      </Panel>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f0f2f5',
    padding: 20,
  },
  panel: {
    width: 400,
    maxWidth: '100%',
    padding: 30,
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
  },
  linkButton: {
    marginTop: 10,
  },
};

export default Login;