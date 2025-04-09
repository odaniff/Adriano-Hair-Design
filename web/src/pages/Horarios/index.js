import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/pt-br';

import 'react-big-calendar/lib/css/react-big-calendar.css';

import {
  TagPicker,
  Drawer,
  Modal,
//   Icon,
  Checkbox,
  DatePicker,
  Button,
} from 'rsuite';
import RemindFillIcon from '@rsuite/icons/RemindFill';
import 'rsuite/dist/rsuite.min.css';  // Alternativa moderna;

import {
  allHorarios,
  addHorario,
  removeHorario,
  updateHorario,
  allServicos,
  saveHorario,
  resetHorario,
} from '../../store/modules/horario/actions';

moment.locale('pt-br');
const localizer = momentLocalizer(moment);

const Horarios = () => {
  const dispatch = useDispatch();
  const {
    horario,
    horarios,
    form,
    components,
    behavior,
    servicos,
  } = useSelector((state) => state.horario);

  const diasDaSemana = [
    'Domingo',
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado',
  ];

  const diasSemanaData = [
    new Date(2025, 3, 6, 0, 0, 0, 0),
    new Date(2025, 3, 7, 0, 0, 0, 0),
    new Date(2025, 3, 8, 0, 0, 0, 0),
    new Date(2025, 3, 9, 0, 0, 0, 0),
    new Date(2025, 3, 10, 0, 0, 0, 0),
    new Date(2025, 3, 11, 0, 0, 0, 0),
    new Date(2025, 3, 12, 0, 0, 0, 0),
  ];

  const setHorario = (key, value) => {
    dispatch(
      updateHorario({
        horario: { ...horario, [key]: value },
      })
    );
  };

  const setComponents = (component, state) => {
    dispatch(
      updateHorario({
        components: { ...components, [component]: state },
      })
    );
  };

  const onHorarioClick = (horario) => {
    dispatch(
      updateHorario({
        horario,
        behavior: 'update',
      })
    );
    setComponents('drawer', true);
  };

  const save = () => {
    // if (
    //   !util.allFields(horario, [
    //     'dias',
    //     'inicio',
    //     'fim',
    //     'servicos',
    //   ])
    // ) {
    //   // DISPARAR O ALERTA
    //   Notification.error({
    //     placement: 'topStart',
    //     title: 'Calma lá!',
    //     description: 'Antes de prosseguir, preencha todos os campos!',
    //   });
    //   return false;
    // }

    if (behavior === 'create') {
      dispatch(addHorario());
    } else {
      dispatch(saveHorario());
    }
  };

  const remove = () => {
    // PERFORM REMOVE
    dispatch(removeHorario());
  };

  const formatEventos = () => {
    let listaEventos = [];

    horarios.forEach((hor) => {
      hor.dias.forEach((dia) => {
        listaEventos.push({
          resource: { horario: hor, backgroundColor: 'black' }, /// Alterei a cor AQUIIIII
          title: `${hor.servicos.length} Serviço (s)`,
          start: new Date(
            diasSemanaData[dia].setHours(
              parseInt(moment(hor.inicio).format('HH')),
              parseInt(moment(hor.inicio).format('mm'))
            )
          ),
          end: new Date(
            diasSemanaData[dia].setHours(
              parseInt(moment(hor.fim).format('HH')),
              parseInt(moment(hor.fim).format('mm'))
            )
          ),
        });
      });
    });

    return listaEventos;
  };

  useEffect(() => {
    dispatch(allHorarios());
    dispatch(allServicos());
  }, [dispatch]);

//   useEffect(() => {
//     dispatch(filterColaboradores());
//   }, [horario.especialidades]);

  return (
    <div className="col p-5 overflow-auto h-100">
      <Drawer
        open={components.drawer}
        size="sm"
        onClose={() => setComponents('drawer', false)}
      >
        <Drawer.Body>
          <h3>{behavior === 'create' ? 'Criar Novo' : 'Atualizar' } Horário de Atendimento</h3>
          <div className="row mt-3">
            <div className="col-12">
              <b>Dias da semana</b>
              <TagPicker
                size="lg"
                block
                value={horario.dias}
                data={diasDaSemana.map((label, value) => ({ label, value }))}
                onChange={(value) => {
                  setHorario('dias', value);
                }}
              />
              <Checkbox
                disabled={horario.dias.length === diasDaSemana.length}
                checked={horario.dias.length === diasDaSemana.length}
                onChange={(v, selected) => {
                  if (selected) {
                    setHorario(
                      'dias',
                      diasDaSemana.map((label, value) => value)
                    );
                  } else {
                    setHorario('dias', []);
                  }
                }}
              >
                {' '}
                Selecionar Todos
              </Checkbox>
            </div>
            <div className="col-6 mt-3">
              <b className="d-block">Horário Inicial</b>
              <DatePicker
                block
                format="HH:mm"
                hideMinutes={(min) => ![0, 30].includes(min)}
                value={horario.inicio}
                onChange={(e) => {
                  setHorario('inicio', e);
                }}
              />
            </div>
            <div className="col-6 mt-3">
              <b className="d-block">Horário Final</b>
              <DatePicker
                block
                format="HH:mm"
                hideMinutes={(min) => ![0, 30].includes(min)}
                value={horario.fim}
                onChange={(e) => {
                  setHorario('fim', e);
                }}
              />
            </div>
            <div className="col-12 mt-3">

            </div>
            <div className="col-12 mt-3">
              <b>Servicos disponíveis</b>
              <TagPicker
                size="lg"
                block
                data={servicos}
                value={horario.servicos}
                onChange={(e) => {
                  setHorario('servicos', e);
                }}
              />
              <Checkbox
                disabled={horario.servicos.length === servicos.length}
                checked={horario.servicos.length === servicos.length}
                onChange={(v, selected) => {
                  if (selected) {
                    setHorario(
                      'servicos',
                      servicos.map((s) => s.value)
                    );
                  } else {
                    setHorario('servicos', []);
                  }
                }}
              >
                {' '}
                Selecionar Todos
              </Checkbox>
            </div>
          </div>
          <Button
            loading={form.saving}
            appearance='primary'
            color={behavior === 'create' ? 'green' : 'primary'}
            size="lg"
            block
            onClick={() => setComponents('confirmSave', true)}
            className="mt-3"
          >
            {behavior === 'create' ? 'Salvar' : 'Atualizar' } Horário de Atendimento
          </Button>
          {behavior === 'update' && (
            <Button
              loading={form.saving}
              appearance='primary'
              color="red"
              size="lg"
              block
              onClick={() => setComponents('confirmDelete', true)}
              className="mt-1"
            >
              Remover Horário de Atendimento
            </Button>
          )}
        </Drawer.Body>
      </Drawer>

      <Modal
        open={components.confirmSave}
        onClose={() => setComponents('confirmSave', false)}
        size="xs"
      >
        <Modal.Header className='text-center'>
          <RemindFillIcon style={{ color: 'rgb(57, 187, 78)', fontSize: 30, marginBottom: '10px' }} />
            <Modal.Title>Tem certeza que deseja {behavior === 'create' ? 'Salvar' : 'Atualizar' } ?</Modal.Title>
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
            Sim, tenho certeza!
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
        <Modal.Body className='text-center'>
            <RemindFillIcon style={{ color: '#ffb300', fontSize: 30, marginBottom: '10px' }} />
                <div>Tem certeza que deseja excluir?</div>
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

      <div className="row">
        <div className="col-12">
          <div className="w-100 d-flex justify-content-between">
            <h2 className="mb-4 mt-0">Horários de Atendimento</h2>
            <div>
              <button
                onClick={() => {
                    setComponents('drawer', true);
                    dispatch(
                        updateHorario({
                            behavior: "create"
                        }),
                    );
                    dispatch(resetHorario());
                }}
                className="btn btn-primary btn-lg"
              >
                <span className="mdi mdi-plus"></span> Novo Horário
              </button>
            </div>
          </div>

          <Calendar
            localizer={localizer}
            onSelectEvent={(e) => {
              const { horario } = e.resource;
              onHorarioClick(horario);
            }}
            onSelectSlot={(slotInfo) => {
              const { start, end } = slotInfo;
              dispatch(
                updateHorario({
                  horario: {
                    ...horario,
                    dias: [moment(start).day()],
                    inicio: start,
                    fim: end,
                  },
                })
              );
              setComponents('drawer', true);
            }}
            formats={{
              dateFormat: 'dd',
              dayFormat: (date, culture, localizer) =>
                localizer.format(date, 'dddd', culture),
            }}
            // events={formatEventos()}
            events={formatEventos()}
            eventPropGetter={(event, start, end, isSelected) => {
              return {
                style: {
                  backgroundColor: event.resource.backgroundColor,
                  borderColor: event.resource.backgroundColor,
                },
              };
            }}
            date={diasSemanaData[moment().day()]}
            view={components.view}
            selectable={true}
            popup={true}
            toolbar={false}
            style={{ height: 600 }}
          />
        </div>
      </div>
    </div>
  );
};

export default Horarios;