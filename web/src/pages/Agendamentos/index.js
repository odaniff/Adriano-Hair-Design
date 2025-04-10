import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/pt-br';

import 'react-big-calendar/lib/css/react-big-calendar.css';

import '../Agendamentos/calendar.css'

import {
  SelectPicker,
  Drawer,
  Modal,
//   Icon,
  DatePicker,
  Button,
  AutoComplete,
} from 'rsuite';
// import RemindFillIcon from '@rsuite/icons/RemindFill';
import CheckRoundIcon from '@rsuite/icons/CheckRound';
import WarningRoundIcon from '@rsuite/icons/WarningRound';
import 'rsuite/dist/rsuite.min.css';  // Alternativa moderna;

import {
    filterAgendamento,
    updateAgendamento,
    addAgendamento,
    resetAgendamento,
    removeAgendamento,
    allServicos,
    allClientes,
    allHorarios,
} from '../../store/modules/agendamento/actions';
import ModalTitle from 'rsuite/esm/Modal/ModalTitle';

moment.locale('pt-br');
const localizer = momentLocalizer(moment);

const Agendamentos = () => {
  const dispatch = useDispatch();

  const {
    agendamentos, 
    agendamento,
    form,
    components,
    servicos,
    clientes,
    behavior,
    // horarios,
  } = useSelector((state) => state.agendamento);

  const formatEventos = agendamentos.map(agendamento => ({
          title: `${agendamento.titulo_servico} - ${agendamento.nome_cliente}`,
          start: moment(agendamento.data_inicio).toDate(),
          end: moment(agendamento.data_fim).toDate(),
          resource: agendamento,
  }));

  const formatRange = (periodo) => {
      let finalRange = {};
      if (Array.isArray(periodo)) {
          finalRange = {
              start: moment(periodo[0]).format('YYYY-MM-DD'),
              end: moment(periodo[periodo.length - 1]).format('YYYY-MM-DD'),
          }
      } else {
          finalRange = {
              start: moment(periodo.start).format('YYYY-MM-DD'),
              end: moment(periodo.end).format('YYYY-MM-DD'),
          }
      }

      return finalRange;
  };
        
  const setAgendamento = (key, value) => {
    dispatch(
      updateAgendamento({
        agendamento: { ...agendamento, [key]: value },
      })
    );
  };

  const setComponents = (component, state) => {
    dispatch(
      updateAgendamento({
        components: { ...components, [component]: state },
      })
    );
  };

  // const onAgendamentoClick = (agendamento) => {
  //   dispatch(
  //     updateAgendamento({
  //       agendamento,
  //       behavior: 'update',
  //     })
  //   );
  //   setComponents('drawer', true);
  // };


  const save = () => {
      dispatch(addAgendamento());
      const start = moment().startOf('year').format('YYYY-MM-DD');
      const end = moment().endOf('year').format('YYYY-MM-DD');
      dispatch(filterAgendamento(start, end));
  };

  const remove = () => {
    // PERFORM REMOVE
    dispatch(removeAgendamento());
    const start = moment().startOf('year').format('YYYY-MM-DD');
    const end = moment().endOf('year').format('YYYY-MM-DD');
    dispatch(filterAgendamento(start, end));
  };

  useEffect(() => {
    dispatch(allServicos());
    dispatch(allClientes());
    dispatch(allHorarios());
    dispatch(
                filterAgendamento(
                    moment().startOf('year').format('YYYY-MM-DD'), // start
                    moment().endOf('year').format('YYYY-MM-DD')  // end
                )
            )
  }, [dispatch]);

  return (
    <div className="col p-5 overflow-auto h-100">
      <Drawer
        open={components.drawer}
        size="sm"
        onClose={() => setComponents('drawer', false)}
      >
        <Drawer.Body>
          <h3>{behavior === 'create' ? 'Criar Novo' : 'Remover' } Agendamento</h3>
          <div className="row mt-3">

          {behavior === 'create' && (  
            <div className="col-12 mt-3">
              <b>Escolha o Serviço</b>
              <SelectPicker
                size="lg"
                block
                data={servicos || []}
                value={agendamento?.servicoID || null}
                onChange={(value) => setAgendamento('servicoID', value)}
                placeholder="Selecione um serviço"
                searchable={false} // Opcional: desativa busca se houver poucos itens
              />
            </div>
          )}

          {behavior === 'create' && (              
            <div className="col-6 mt-3">
              <b className="d-block">Data e Horário</b>
              <DatePicker
                block
                format="dd/MM/yyyy HH:mm"
                hideMinutes={(min) => ![0, 30].includes(min)}
                hideHours={(hour) =>  hour < 8 || hour > 17 }
                onChange={(datetime) => {
                  setAgendamento('data_inicio', datetime);
                }}
              />
            </div>
          )}

          {behavior === 'create' && (   
            <div className="col-12 mt-3">
            <b>E-mail</b>
            <AutoComplete
              size="lg"
              data={clientes?.map(c => ({
                label: c.email,  // Texto exibido
                value: c.email   // Valor armazenado
              })) || []}
              value={agendamento?.email || ''}
              onChange={(value) => setAgendamento('email', value)}
              placeholder="Digite seu e-mail"
              renderItem={item => (
                <div>{item.label}</div> 
              )}
            />
            </div>
          )}


        </div>

          {behavior === 'create' && (
            <Button
              loading={form.saving}
              appearance='primary'
              color='green'
              size="lg"
              block
              onClick={() => setComponents('confirmSave', true)}
              className="mt-3"
            >
              Agendar
            </Button>
          )}
            
          {/* {behavior === 'update' && (
            <Button
              loading={form.saving}
              appearance='primary'
              color="red"
              size="lg"
              block
              onClick={() => setComponents('confirmDelete', true)}
              className="mt-1"
            >
              Remover Agendamento
            </Button>
          )} */}

        </Drawer.Body>
      </Drawer>

      <Modal
        open={components.confirmSave}
        onClose={() => setComponents('confirmSave', false)}
        size="xs"
      >
        <Modal.Header className='text-center'>
          <CheckRoundIcon style={{ color: 'rgb(57, 187, 78)', fontSize: 30, marginBottom: '20px' }} />
          <Modal.Title>Confirmar Agendamento?</Modal.Title>
        </Modal.Header>
        <Modal.Body className='text-center'>
                {/* <div>Tem certeza que deseja salvar?</div> */}
        </Modal.Body>
        <Modal.Footer className='text-center'>
            <Button 
                loading={form.saving}
                onClick={() => save()}
                appearance='primary' 
                color="green"
            >
            Sim!
          </Button>
          <Button
            onClick={() => setComponents('confirmSave', false)}
            appearance="subtle"
          >
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        open={components.confirmDelete}
        onClose={() => setComponents('confirmDelete', false)}
        size="xs"
      >
        <Modal.Header className='text-center'>
            <WarningRoundIcon style={{ color: 'rgb(255, 47, 47)', fontSize: 30, marginBottom: '10px' }} />
            <ModalTitle>Remover Agendamento?</ModalTitle>
        </Modal.Header>
        <Modal.Body className='text-center'>
            <div>Essa ação será irreversível!</div>
        </Modal.Body>
        <Modal.Footer className='text-center'>
            <Button 
                loading={form.saving}
                onClick={() => {
                    remove();
                    setComponents('confirmDelete', false)
                }}
                appearance='primary' 
                color="red"
            >
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
            <h2 className="mb-4 mt-0">Agendamentos</h2>
            <div>
              <button
                onClick={() => {
                    setComponents('drawer', true);
                    dispatch(
                        updateAgendamento({
                          behavior: "create"
                        }),
                    );
                    dispatch(resetAgendamento());
                }}
                className="btn btn-primary btn-lg"
              >
                <span className="mdi mdi-plus"></span> Novo Agendamento
              </button>
            </div>
          </div>

           <Calendar
              localizer={localizer}
              onRangeChange={(periodo) => {
                  const {start, end } = formatRange(periodo)
                  dispatch(filterAgendamento(start, end))
              }}
              // onSelectEvent={(e) => {
              //   onAgendamentoClick(e.resource);
              // }}
              events={formatEventos}
              defaultView='month' // inicia o calendário no modo mês
              selectable={true}
              popup={true}
              style={{ height: 500 }}
           />
        </div>
      </div>
    </div>
  );
};

export default Agendamentos;