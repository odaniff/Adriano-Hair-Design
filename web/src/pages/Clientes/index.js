import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  filterCliente,
  updateCliente,
  addCliente,
  resetCliente,
  allClientes,
  unlinkCliente,
  linkCliente,
  deleteCliente,
} from '../../store/modules/cliente/actions.js';
import { Button, Drawer, Modal, Tag } from 'rsuite';
import RemindFillIcon from '@rsuite/icons/RemindFill';
// import { Icon } from '@rsuite/icons';
import 'rsuite/dist/rsuite.min.css';  // Alternativa moderna;
import Table from '../../components/Table';
import moment from 'moment';


const Clientes = () => {
    
    const dispatch = useDispatch();
    const { clientes, cliente, behavior, form, components} = useSelector((state) => state.cliente);
    const [confirmInactivate, setConfirmInactivate] = useState(false); //AQUIIIII
    const [confirmActivate, setConfirmActivate] = useState(false);

    const setComponents = (component, state) => {
        dispatch(
          updateCliente({
            components: { ...components, [component]: state },
          })
        );
    };

    const setCliente = (key, value) => {
        dispatch(  
            updateCliente({
                cliente: { ...cliente, [key]: value },
            })
        );
    };

    const save = () => {
        dispatch(addCliente());
    };

    const remove = () => {
        dispatch(unlinkCliente(cliente._id));
        setComponents('confirmDelete', false);
    };

    const active = () => {
        dispatch(linkCliente(cliente._id));
        setComponents('confirmDelete', false);
    };

    const removeDelete = () => {
        dispatch(deleteCliente(cliente._id));
        setComponents('confirmDelete', false);
    };

    useEffect(() => {
        dispatch(allClientes());
    }, [dispatch]);

    return (
        /*o col é para pegar todas as colunas, pois o Bootstrao já tem um sistema de grid*/
        <div className="container-fluid col p-5 overflow-auto h-100">
            <Drawer open={components.drawer} size="sm" onClose={() => setComponents('drawer', false)}>
                <Drawer.Body>
                    <h3>{behavior === "create" ? 'Cadastrar' : 'Atualizar' } Cliente</h3>
                    
                    <div className='row mt-3'>
                        
                        <div className='form-group col-12 mb-3'>
                            <b>E-mail</b>
                            <div className='input-group'>
                                <input 
                                    type="email" 
                                    className='form-control' 
                                    placeholder='E-mail do cliente' 
                                    value={cliente.email}
                                    onChange={(e) => 
                                        setCliente('email', e.target.value)    
                                    }
                                />
                                <div className='input-group-append'>
                                    <Button 
                                        appearance='primary' 
                                        color='green'
                                        loading={form.filtering}
                                        disabled={form.filtering}
                                        onClick={() => dispatch(filterCliente())}
                                    >
                                    Pesquisar
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className='form-group col-6'>
                            <b className=''>Nome</b>
                            <input 
                                type="text" 
                                className='form-control' 
                                placeholder='Nome' 
                                disabled={form.disabled}
                                value={cliente.nome}
                                onChange={(e) => setCliente('nome', e.target.value)}
                            />
                        </div>

                        <div className='form-group col-6'>
                            <b className=''>Telefone / Whatsapp</b>
                            <input 
                                type="text" 
                                className='form-control' 
                                placeholder='Telefone / Whatsapp' 
                                disabled={form.disabled}
                                value={cliente.telefone}
                                onChange={(e) => {
                                    console.log('digitando:', e.target.value);
                                    setCliente('telefone', e.target.value)
                                }}
                            />
                        </div>

                        <div className='form-group col-6 mt-2'>
                            <b className=''>Data de Nascimento</b>
                            <input 
                                type="date" 
                                className='form-control' 
                                placeholder='Data de Nascimento do cliente' 
                                disabled={form.disabled}
                                value={cliente.dataNascimento}
                                onChange={(e) => setCliente('dataNascimento', e.target.value)}
                            />
                        </div>

                        <div className='form-group col-6 mt-2'>
                            <b className=''>Sexo</b>
                            <select 
                                className='form-control' 
                                disabled={form.disabled}
                                value={cliente.sexo}
                                onChange={(e) => setCliente('sexo', e.target.value)}
                            > 
                                <option value="M">Masculino</option>
                                <option value="F">Feminino</option>
                            </select>
                        </div>

                        <div className="form-group col-6 mt-2">
                            <b>Tipo de documento</b>
                            <select
                                disabled={form.disabled}
                                className="form-control"
                                value={cliente.documento.tipo}
                                onChange={(e) =>
                                setCliente('documento', {
                                    ...cliente.documento,
                                    tipo: e.target.value,
                                })
                                }
                            >
                                <option value="CPF">CPF</option>
                                <option value="CNPJ">CNPJ</option>
                            </select>
                        </div>

                        <div className="form-group col-6 mt-2">
                            <b className="">Número do documento</b>
                            <input
                                type="text"
                                className="form-control"
                                disabled={form.disabled}
                                value={cliente.documento.numero}
                                onChange={(e) =>
                                setCliente('documento', {
                                    ...cliente.documento,
                                    numero: e.target.value,
                                })
                                }
                            />
                        </div>
                        
                        <div className="form-group col-3 mt-2">
                            <b className="">UF</b>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="UF"
                                disabled={form.disabled}
                                value={cliente.endereco.UF}
                                onChange={(e) =>
                                setCliente('endereco', {
                                    ...cliente.endereco,
                                    UF: e.target.value,
                                })
                                }
                            />
                        </div>
                    
                        <div className="form-group col-9 mt-2">
                            <b className="">Cidade</b>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Cidade"
                                disabled={form.disabled}
                                value={cliente.endereco.cidade}
                                onChange={(e) =>
                                setCliente('endereco', {
                                    ...cliente.endereco,
                                    cidade: e.target.value,
                                })
                                }
                            />
                        </div>
                        
                        {behavior === 'create' && (
                        <div className="form-group col-9 mt-2">
                            <b className="">Senha</b>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Senha"
                                disabled={form.disabled}
                                value={cliente.senha}
                                onChange={(e) =>
                                setCliente('senha', e.target.value)}
                            />
                        </div>
                        )}

                    </div>

                    {behavior !== 'create' && (
                        <Button
                            block
                            className="mt-3"
                            appearance="ghost"
                            color= {cliente.status === 'A' ? 'red' : 'green'}
                            size="lg" 
                            onClick={() => {
                                if (cliente.status === 'A') {
                                    setConfirmInactivate(true)
                                } else {
                                    setConfirmActivate(true);
                                } 
                            }}
                            >
                            {cliente.status === 'A' ? 'Inativar' : 'Ativar'} cliente
                        </Button>

                    )}


                    <Button
                        //disabled={ableToSave(cliente)}
                        block
                        className="mt-3"
                        appearance='primary'
                        color={behavior === 'create' ? 'green' : 'red'}
                        size="lg"
                        loading={form.saving}
                        onClick={() => {
                        if (behavior === 'create') {
                            save();
                        } else {
                            setComponents('confirmDelete', true);
                        }
                        }}
                    >
                        {behavior === 'create' ? 'Salvar' : 'Remover'} cliente
                    </Button>

                </Drawer.Body>
            </Drawer>

            <Modal open={confirmInactivate} onClose={() => setConfirmInactivate(false)} size="xs">
                <Modal.Body className='text-center'>
                    <RemindFillIcon style={{ color: '#ffb300', fontSize: 30, marginBottom: '10px' }} />
                    <div>Tem certeza que deseja inativar este cliente?</div>
                </Modal.Body>
                <Modal.Footer className='text-center'>
                    <Button
                    appearance='primary'
                    color="red"
                    onClick={() => {
                        remove();
                        setConfirmInactivate(false);
                        setComponents('drawer', false);
                    }}
                    >
                    Sim, inativar
                    </Button>
                    <Button appearance="subtle" onClick={() => setConfirmInactivate(false)}>
                    Cancelar
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal open={confirmActivate} onClose={() => setConfirmInactivate(false)} size="xs">
                <Modal.Body className='text-center'>
                    <RemindFillIcon style={{ color: '#ffb300', fontSize: 30, marginBottom: '10px' }} />
                    <div>Tem certeza que deseja ativar este cliente?</div>
                </Modal.Body>
                <Modal.Footer className='text-center'>
                    <Button
                    appearance='primary'
                    color="green"
                    onClick={() => {
                        active();
                        setConfirmActivate(false);
                        setComponents('drawer', false);
                    }}
                    >
                    Sim, ativar
                    </Button>
                    <Button appearance="subtle" onClick={() => setConfirmActivate(false)}>
                    Cancelar
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal
                open={components.confirmDelete}
                onClose={() => setComponents('confirmDelete', false)}
                size="xs"
            >
                <Modal.Body className='text-center'>
                    <RemindFillIcon style={{ color: '#ffb300', fontSize: 30, marginBottom: '10px' }} />
                    <div>Tem certeza que deseja excluir?</div> 
                    <div>Essa ação será irreversível!</div>
                </Modal.Body>
                <Modal.Footer className='text-center'>
                    <Button
                        loading={form.saving}
                        onClick={() => {
                            removeDelete();
                        }}
                        appearance='primary'
                        color="red"
                    >
                    Sim, tenho certeza!
                    </Button>

                    <Button
                        onClick={() => setComponents('confirmDelete', false)}
                        appearance="subtle"
                    >
                        Cancelar
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* row é para trabalhar com as colunas do sistema de grid do Bootstrap */} 
            <div className="row">
                {/* col-12 cria uma coluna que ocupa 12 colunas do grid do Bootstrap */}
                <div className="col-12">
                    <div className="w-100 d-flex justify-content-between align-items-center mb-4">
                        <h2 className="mb-2 mt-0">Clientes</h2>
                        <div>
                            <button 
                                className="btn btn-primary btn-lg" 
                                type="button"
                                onClick={() => {
                                    dispatch(resetCliente())
                                    dispatch(
                                        updateCliente({
                                            behavior: 'create',
                                        })
                                    )
                                    setComponents('drawer', true);
                                }}
                            >
                                <span className="mdi mdi-plus">Novo Cliente</span>
                            </button>
                        </div>
                    </div>
                    <Table 
                        loading={form.filtering}
                        data={clientes.map(c => c.cliente)}
                        config = {[
                            {label: 'Nome', key: 'nome', width: 150, fixed: true},
                            {label: 'Telefone / Whatsapp', key: 'telefone', width: 150},
                            {label: 'E-mail', key: 'email', width: 200},
                            {
                                label: 'Status', 
                                content: (cliente) => (
                                    <Tag color={cliente.status === 'A' ? 'green' : 'red'}>
                                    {cliente.status === 'A' ? 'Ativo' : 'Inativo'}
                                    </Tag>
                                ),
                                width: 100, 
                            },
                            {
                                label: 'Sexo', 
                                content: (cliente) => cliente.sexo === 'M' ? 'Masculino' : 'Feminino',
                                width: 100, 
                            },
                            {
                                label: 'Data Cadastro', 
                                content: (cliente) => moment(cliente.dataCadastro).format('DD-MM-YYYY'), 
                                width: 100, 
                            },
                        ]}
                        actions={(cliente) => (
                            <div>
                                <Button size='xs' appearance='subtle' color='green'>
                                    Ver informações
                                </Button>
                            </div>
                        )}
                        onrowclick={(cliente) => {
                            dispatch (
                                updateCliente({
                                    behavior: 'update',
                                })
                            );
                            dispatch(
                                updateCliente({
                                    cliente: cliente,
                                })
                            );
                            setComponents('drawer', true);
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default Clientes;