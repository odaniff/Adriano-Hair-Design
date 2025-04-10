import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';

import {
    updateServico,
    addServico,
    saveServico,
    allServicos,
    removeArquivo,
    resetServico,
    removeServico,
} from '../../store/modules/servico/actions';
import awsConfig from '../../services/util';

import {
    DatePicker,
    Drawer,
    Uploader,
    Button,
    // toaster as Notification,
    Tag,
    Modal,
} from 'rsuite';
import ModalTitle from 'rsuite/esm/Modal/ModalTitle';
// import CheckRoundIcon from '@rsuite/icons/CheckRound';
import WarningRoundIcon from '@rsuite/icons/WarningRound';
// import RemindFillIcon from '@rsuite/icons/RemindFill';

// import { Icon } from '@rsuite/icons'; // Se estiver usando ícones
// import { toaster } from 'rsuite'; // Para notificações

import 'rsuite/dist/rsuite.min.css';  // Alternativa moderna;

import Table from '../../components/Table';

const DashboardServicos = () => {
  
    const dispatch = useDispatch();
    const { servico, servicos, form, components, behavior } = useSelector(
    (state) => state.servico
  );

  const setServico = (key, value) => {
    dispatch(
      updateServico({
        servico: { ...servico, [key]: value },
      })
    );
  };

  const setComponents = (component, state) => {
    dispatch(
      updateServico({
        components: { ...components, [component]: state },
      })
    );
  };

  const save = () => {

    if (behavior === 'create') {
      dispatch(addServico());
    } else {
      dispatch(saveServico());
    }
  };

  const edit = (servico) => {
    dispatch(
      updateServico({
        servico,
        behavior: 'update',
      })
    );

    setComponents('drawer', true);
  };

  const remove = (servicoId) => {
    // PERFORM REMOVE
    dispatch(removeServico(servicoId));
  };

  useEffect(() => {
    dispatch(allServicos());
  }, [dispatch]);

  return (
    <div className="col p-5 overflow-auto h-100">
        <Drawer
        open={components.drawer}
        size="sm"
        onClose={() => setComponents('drawer', false)}
        >
        <Drawer.Body>
            <h3>{behavior === 'create' ? 'Criar' : 'Atualizar'} serviço</h3>
            <div className="row mt-3">
            <div className="form-group col-6">
                <b className="">Título</b>
                <input
                type="text"
                className="form-control"
                placeholder="Titulo do serviço"
                value={servico.titulo}
                onChange={(e) => {
                    setServico('titulo', e.target.value);
                }}
                />
            </div>
            <div className="form-group col-3">
                <b className="">Preço (R$)</b>
                <input
                type="number"
                className="form-control"
                placeholder="Preço"
                value={servico.preco}
                onChange={(e) => setServico('preco', e.target.value)}
                />
            </div>
            <div className="form-group col-4">
                <b className="d-block mt-2">Duração</b>
                <DatePicker
                    format="HH:mm"
                    hideMinutes={(min) => ![0,30].includes(min)}
                    value={
                        servico.duracao != null
                        ? moment().startOf('day').add(servico.duracao, 'minutes').toDate()
                        : null
                    }
                    onChange={(e) => {
                        if (e) {
                        // só executa isso se 'e' não for null ou undefined
                        const totalMinutos = e.getHours() * 60 + e.getMinutes();
                        setServico('duracao', totalMinutos);
                        } else {
                        // se o usuário clicou no "X" e limpou o campo
                        setServico('duracao', 30); // valor default, 
                        }
                    }}
                />
            </div>
            <div className="form-group col-4">
                <b className="d-block mt-2">Status</b>
                <select
                className="form-control"
                value={servico.status}
                onChange={(e) => setServico('status', e.target.value)}
                >
                <option value="A">Ativo</option>
                <option value="I">Inativo</option>
                </select>
            </div>

            <div className="form-group col-12">
                <b className="d-block mt-2">Descrição</b>
                <textarea
                    rows="5"
                    className="form-control"
                    placeholder="Descrição do serviço..."
                    value={servico.descricao}
                    onChange={(e) => setServico('descricao', e.target.value)}
                ></textarea>
            </div>

            <div className="form-group col-12">
                <b className="d-block mt-2">Imagens do serviço</b>
                <Uploader
                    multiple
                    autoUpload={false}
                    listType="picture"
                    defaultFileList={servico.arquivos.map((arquivo, index) => ({
                        name: arquivo?.URL,
                        fileKey: index,
                        url: `${awsConfig.AWS_BUCKET_URL}/${arquivo?.URL}`,
                    }))}
                    onChange={(files) => {
                        const arquivos = files
                        .filter((f) => f.blobFile)
                        .map((f) => f.blobFile);

                        setServico('arquivos', arquivos);
                    }}
                    onRemove={(file) => {
                        if (behavior === 'update' && file.url) {
                        dispatch(removeArquivo(file.name));
                        }
                    }}
                    >
                    <button>
                        <span class="mdi mdi-camera-plus"></span>
                    </button>
                </Uploader>
            </div>
            </div>
            
            <Button
            loading={form.saving}
            appearance='primary'
            color={behavior === 'create' ? 'green' : 'cyan'}
            size="lg"
            block
            onClick={() => {
                save();
                setComponents("drawer", false);
            }}
            className="mt-3"
            >
            {behavior === 'create' ? 'Salvar' : 'Atualizar'} Serviço
            </Button>

            {behavior === 'update' && (
            <Button
                loading={form.saving}
                appearance='primary'
                color="red"
                size="lg"
                block
                onClick={() => setComponents('confirmDelete', true)}
                className="mt-3"
            >
                Remover Serviço
            </Button>
            )}
        </Drawer.Body>
        </Drawer>

        <Modal
        open={components.confirmDelete}
        onClose={() => setComponents('confirmDelete', false)}
        size="xs"
        >
        <Modal.Header className='text-center'>
            <WarningRoundIcon style={{ color: 'rgb(255, 47, 47)', fontSize: 30, marginBottom: '10px' }} />
            <ModalTitle>Remover Servico?</ModalTitle>
        </Modal.Header>
        <Modal.Body className='text-center'>
            <div>Essa ação será irreversível!</div>
        </Modal.Body>
        <Modal.Footer className='text-center'>
            <Button loading={form.saving} onClick={() => remove()} appearance='primary' color="red">
            Sim, remover
            </Button>
            <Button
            onClick={() => setComponents('confirmDelete', false)}
            appearance="subtle"
            >
            Cancelar
            </Button>
        </Modal.Footer>
        </Modal>

        <div className="row">
            <div className="col-12">
                <div className="w-100 d-flex justify-content-between">
                <h2 className="mb-4 mt-0">Dashboard Serviços</h2>
                <div>
                    <button
                    onClick={() => {
                        dispatch(
                        updateServico({
                            behavior: 'create',
                        })
                        );
                        dispatch(resetServico());
                        setComponents('drawer', true);
                    }}
                    className="btn btn-primary btn-lg"
                    >
                    <span className="mdi mdi-plus"></span> Novo Serviço
                    </button>
                </div>
                </div>

                <Table
                data={servicos}
                rows={servicos}
                loading={form.filtering}
                config={[
                    {
                    label: 'Titulo',
                    key: 'titulo',
                    sortable: true,
                    fixed: true,
                    width: 175,
                    },
                    {
                    label: 'Duração',
                    key: 'duracao',
                    sortable: true,
                    width: 150,
                    content: (servico) => moment().startOf('day').add(servico.duracao, 'minutes').format('HH:mm')
                    },
                    {
                    label: 'Preço',
                    key: 'preco',
                    width: 150,
                    content: (servico) => `R$ ${servico.preco.toFixed(2)}`,
                    sortable: true,
                    },
                    {
                    label: 'Status',
                    key: 'status',
                    content: (servico) => (
                        <Tag color={servico.status === 'A' ? 'green' : 'red'}>
                        {servico.status === 'A' ? 'Ativo' : 'Inativo'}
                        </Tag>
                    ),
                    sortable: true,
                    width: 150,
                    },
                    {
                    label: 'Data de cadastro',
                    key: 'dataCadastro',
                    sortable: true,
                    content: (servico) => (
                        moment(servico.dataCadastro).format('DD/MM/YYYY')
                    ),
                    width: 200,
                    },
                ]}
                actions={(item) => (
                    <>
                    <Button
                        appearance='default'
                        color="blue"
                        size="sm"
                        onClick={() => {
                        edit(item);
                        }}
                    >
                        <span className="mdi mdi-pencil"></span>
                    </Button>
                </>

                )}
                onrowclick={(servico) => {
                dispatch (
                        updateServico({
                            behavior: 'update',
                        })
                    );
                    dispatch(
                        updateServico({
                            servico: servico,
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

export default DashboardServicos;