import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Input, 
  Button, 
  DatePicker, 
  SelectPicker, 
  Panel, 
  FlexboxGrid, 
  Divider,
  Message,
  toaster
} from 'rsuite';
import { signUpRequest } from '../../store/modules/auth/actions';

const Cadastro = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector(state => state.auth);

  const [form, setForm] = useState({
    nome: '',
    email: '',
    senha: '',
    telefone: '',
    sexo: 'F',
    dataNascimento: null,
    endereco: {
      cidade: '',
      UF: '',
      pais: 'Brasil',
    },
    documento: {
      tipo: 'CPF',
      numero: '',
    },
  });

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

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleEnderecoChange = (key, value) => {
    setForm(prev => ({
      ...prev,
      endereco: { ...prev.endereco, [key]: value }
    }));
  };

  const handleDocumentoChange = (key, value) => {
    setForm(prev => ({
      ...prev,
      documento: { ...prev.documento, [key]: value }
    }));
  };

  const handleSubmit = () => {
    // Validação básica
    if (!form.email || !form.senha || !form.nome) {
      toaster.push(
        <Message showIcon type="warning" closable>
          Preencha os campos obrigatórios
        </Message>,
        { placement: 'topCenter' }
      );
      return;
    }

    dispatch(signUpRequest({
      ...form,
      dataNascimento: form.dataNascimento?.toISOString() || null
    }));
  };

  const sexoOptions = [
    { label: 'Feminino', value: 'F' },
    { label: 'Masculino', value: 'M' },
  ];

  const docOptions = [
    { label: 'CPF', value: 'CPF' },
    { label: 'CNPJ', value: 'CNPJ' },
  ];

  return (
    <div style={styles.container}>
      <FlexboxGrid justify="center">
        <FlexboxGrid.Item colspan={12}>
          <Panel bordered shaded>
            <h4 style={styles.title}>Cadastro de Cliente</h4>
            <Input
              placeholder="Nome*"
              value={form.nome}
              onChange={value => handleChange('nome', value)}
              style={styles.input}
            />
            
            <Input
              placeholder="Email*"
              type="email"
              value={form.email}
              onChange={value => handleChange('email', value)}
              style={styles.input}
            />
            
            <Input
              placeholder="Senha*"
              type="password"
              value={form.senha}
              onChange={value => handleChange('senha', value)}
              style={styles.input}
            />
            
            <Input
              placeholder="Telefone"
              value={form.telefone}
              onChange={value => handleChange('telefone', value)}
              style={styles.input}
            />
            
            <DatePicker
              placeholder="Data de Nascimento"
              value={form.dataNascimento}
              onChange={value => handleChange('dataNascimento', value)}
              style={styles.input}
              block
            />
            
            <SelectPicker
              data={sexoOptions}
              placeholder="Sexo"
              value={form.sexo}
              onChange={value => handleChange('sexo', value)}
              style={styles.input}
              block
            />
            
            <Divider>Endereço</Divider>
            
            <Input
              placeholder="Cidade"
              value={form.endereco.cidade}
              onChange={value => handleEnderecoChange('cidade', value)}
              style={styles.input}
            />
            
            <Input
              placeholder="UF"
              value={form.endereco.UF}
              onChange={value => handleEnderecoChange('UF', value)}
              style={styles.input}
            />
            
            <Divider>Documento</Divider>
            
            <SelectPicker
              data={docOptions}
              placeholder="Tipo de documento"
              value={form.documento.tipo}
              onChange={value => handleDocumentoChange('tipo', value)}
              style={styles.input}
              block
            />
            
            <Input
              placeholder="Número do documento"
              value={form.documento.numero}
              onChange={value => handleDocumentoChange('numero', value)}
              style={styles.input}
            />
            
            <Button 
              appearance="primary" 
              color='green'
              block 
              onClick={handleSubmit}
              loading={loading}
              style={styles.button}
            >
              Cadastrar
            </Button>
            
            <Button 
              appearance="primary" 
              block 
              onClick={() => navigate('/login')}
              style={styles.linkButton}
            >
              Já tem conta? Faça login
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

          </Panel>
        </FlexboxGrid.Item>
      </FlexboxGrid>
    </div>
  );
};

const styles = {
  container: {
    padding: 50,
    backgroundColor: '#f0f2f5',
    minHeight: '100vh',
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 20,
  },
  linkButton: {
    marginTop: 10,
  },
  title: {
    textAlign: 'center',
  }
};

export default Cadastro;