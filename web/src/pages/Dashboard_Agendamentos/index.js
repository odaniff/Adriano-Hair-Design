import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'

import { Calendar, momentLocalizer } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment'
import 'moment/locale/pt-br';

import '../Agendamentos/calendar.css'

import { filterAgendamento } from '../../store/modules/agendamento/actions';

moment.locale('pt-br');
const localizer = momentLocalizer(moment)

const DashboardAgendamentos = () => {

    const dispatch = useDispatch()
    const {agendamentos} =  useSelector((state) => state.agendamento)
    
    const formatEventos = agendamentos.map(agendamento => ({
        title: `${agendamento.titulo} - ${agendamento.email}`,
        start: moment(agendamento.data_inicio).toDate(),
        end: moment(agendamento.data_fim).toDate(),
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

    useEffect(() => {
        dispatch(
            filterAgendamento(
                moment().startOf('year').format('YYYY-MM-DD'), // start
                moment().endOf('year').format('YYYY-MM-DD')  // end
            )
        )
    }, [dispatch])

    return (
        /*o col é para pegar todas as colunas, pois o Bootstrao já tem um sistema de grid*/
        <div className="container-fluid col p-5 overflow-auto h-100">
            {/* row é para trabalhar com as colunas do sistema de grid do Bootstrap */} 
            <div className="row">
                {/* col-12 cria uma coluna que ocupa 12 colunas do grid do Bootstrap */}
                <div className="col-12">
                    <h2 className="mb-2 mt-0">Dashboard Agendamentos</h2>
                    {/* <p className='mb-2 mt-0'> Bem-vindo à página de agendamentos!</p> */}
                    <Calendar
                        localizer={localizer}
                        onRangeChange={(periodo) => {
                            const {start, end } = formatRange(periodo)
                            dispatch(filterAgendamento(start, end))
                        }}
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

export default DashboardAgendamentos;