import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Carousel, Button, Panel } from 'rsuite';
import { Icon } from '@rsuite/icons';
import { ArrowLeft, ArrowRight } from '@rsuite/icons';
import 'rsuite/dist/rsuite.min.css';
import moment from 'moment';
import awsConfig from '../../services/util';

import { allServicos } from '../../store/modules/servico/actions';

const Servicos = () => {
  const dispatch = useDispatch();
  const { servicos } = useSelector((state) => state.servico);

  useEffect(() => {
    dispatch(allServicos());
  }, [dispatch]);

  // Dividir os serviços em duas colunas
  const half = Math.ceil(servicos.length / 2);
  const colunaEsquerda = servicos.slice(0, half);
  const colunaDireita = servicos.slice(half);

  return (
    <div className="servicos-page">
      <div className="servicos-header">
        <h1 className="titulo-destaque">Nossos Serviços Exclusivos</h1>
        <p className="subtitulo">Soluções personalizadas para atender suas necessidades</p>
        <div className="divisor"></div>
      </div>

      {servicos.length > 0 ? (
        <div className="servicos-grid">
          <div className="servicos-coluna">
            {colunaEsquerda.map((servico) => (
              <ServicoCard key={servico._id} servico={servico} />
            ))}
          </div>
          
          <div className="servicos-coluna">
            {colunaDireita.map((servico) => (
              <ServicoCard key={servico._id} servico={servico} />
            ))}
          </div>
        </div>
      ) : (
        <div className="sem-servicos">
          <p>Nenhum serviço disponível no momento.</p>
        </div>
      )}

    </div>
  );
};

// Componente de card de serviço individual
const ServicoCard = ({ servico }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const next = () => {
    setActiveIndex((prev) => (prev === servico.arquivos.length - 1 ? 0 : prev + 1));
  };

  const previous = () => {
    setActiveIndex((prev) => (prev === 0 ? servico.arquivos.length - 1 : prev - 1));
  };

  return (
    <Panel shaded bordered bodyFill className="servico-card">
      <div className="servico-carrossel-container">
        {servico.arquivos.length > 1 && (
          <Button 
            className="carrossel-nav-button prev" 
            onClick={previous}
            appearance="subtle"
            circle
          >
            <Icon as={ArrowLeft} />
          </Button>
        )}

        <div className="servico-imagens">
          <Carousel
            activeIndex={activeIndex}
            onSelect={setActiveIndex}
            placement="bottom"
            shape="bar"
            className="custom-slider"
          >
            {servico.arquivos.map((arquivo, i) => (
              <div key={i} className="imagem-container">
                <img 
                  src={`${awsConfig.AWS_BUCKET_URL}/${arquivo.URL}`} 
                  alt={`Imagem ${i + 1} do serviço ${servico.titulo}`}
                />
              </div>
            ))}
          </Carousel>
        </div>

        {servico.arquivos.length > 1 && (
          <Button 
            className="carrossel-nav-button next" 
            onClick={next}
            appearance="subtle"
            circle
          >
            <Icon as={ArrowRight} />
          </Button>
        )}
      </div>

      <div className="servico-info">
        <h2>{servico.titulo}</h2>
        
        <div className="servico-meta">
          <span className="servico-preco">R$ {servico.preco.toFixed(2)}</span>
          <span className="servico-duracao">
            <Icon icon="clock-o" /> {moment().startOf('day').add(servico.duracao, 'minutes').format('HH:mm')}h
          </span>
          <span className={`servico-status ${servico.status === 'A' ? 'ativo' : 'inativo'}`}>
            {servico.status === 'A' ? 'Disponível' : 'Indisponível'}
          </span>
        </div>
        
        <p className="servico-descricao">{servico.descricao}</p>
        
        <div className="servico-indicators">
          {servico.arquivos.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === activeIndex ? 'active' : ''}`}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        .servico-card {
          border-radius: 12px !important;
          overflow: hidden;
          transition: all 0.3s ease;
          background: white;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
        }
        
        .servico-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
        }
        
        .servico-carrossel-container {
          position: relative;
          height: 250px;
        }
        
        .servico-imagens {
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        
        .imagem-container {
          width: 100%;
          height: 250px;
        }
        
        .imagem-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        
        .custom-slider:hover .imagem-container img {
          transform: scale(1.03);
        }
        
        .carrossel-nav-button {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 10;
          background: rgba(255, 255, 255, 0.8) !important;
          border: none;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }
        
        .carrossel-nav-button:hover {
          background: rgba(255, 255, 255, 0.95) !important;
          transform: translateY(-50%) scale(1.1);
        }
        
        .prev {
          left: 15px;
        }
        
        .next {
          right: 15px;
        }
        
        .servico-info {
          padding: 25px;
        }
        
        .servico-info h2 {
          font-size: 1.5rem;
          color: var(--primary);
          margin-bottom: 15px;
          font-weight: 600;
        }
        
        .servico-meta {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 15px;
          flex-wrap: wrap;
        }
        
        .servico-preco {
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--success);
        }
        
        .servico-duracao {
          display: flex;
          align-items: center;
          gap: 5px;
          color: #666;
          font-size: 0.9rem;
        }
        
        .servico-status {
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 500;
        }
        
        .servico-status.ativo {
          background-color: rgba(6, 214, 160, 0.1);
          color: var(--success);
        }
        
        .servico-status.inativo {
          background-color: rgba(214, 40, 40, 0.1);
          color: var(--danger);
        }
        
        .servico-descricao {
          color: #555;
          line-height: 1.7;
          margin-bottom: 20px;
        }
        
        .servico-indicators {
          display: flex;
          justify-content: center;
          gap: 8px;
        }
        
        .indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #ddd;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          padding: 0;
        }
        
        .indicator.active {
          background: var(--primary);
          transform: scale(1.3);
        }
        
        @media (max-width: 768px) {
          .servico-carrossel-container {
            height: 200px;
          }
          
          .imagem-container {
            height: 200px;
          }
          
          .servico-info {
            padding: 20px;
          }
          
          .servico-info h2 {
            font-size: 1.3rem;
          }
        }
      `}</style>
    </Panel>
  );
};

export default Servicos;