import React from 'react';
import { Button, ButtonToolbar } from 'rsuite';

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-section about">
          <h3 className="footer-title">Adriano Hair Design</h3>
          <p className="footer-text">Transformando seu visual com excelência desde 2010.</p>
          
          <div className="contact-info">
            <div className="contact-item">
              <span className="mdi mdi-map-marker-outline"></span>
              <span>Av. Principal, 1234 - Centro, Cidade/UF</span>
            </div>
            <div className="contact-item">
              <span className="mdi mdi-clock-outline"></span>
              <span>Seg-Sex: 9h-19h | Sáb: 9h-14h</span>
            </div>
            <div className="contact-item">
              <span className="mdi mdi-phone"></span>
              <span>(11) 99999-9999</span>
            </div>
            <div className="contact-item">
              <span className="mdi mdi-email-outline"></span>
              <span>contato@adrianohair.com</span>
            </div>
          </div>
        </div>

        <div className="footer-section links">
          <h3 className="footer-title">Links Rápidos</h3>
          <ul>
            <li><a href="/sobre">Sobre Nós</a></li>
            <li><a href="/contato">Contato</a></li>
          </ul>
        </div>

        <div className="footer-section social">
          <h3 className="footer-title">Redes Sociais</h3>
          <ButtonToolbar className="social-buttons">
            <Button 
              appearance="subtle" 
              color="red" 
              href="https://instagram.com" 
              target="_blank"
            >
              <span className="mdi mdi-instagram"></span>
              <span>Instagram</span>
            </Button>
            <Button 
              appearance="subtle" 
              color="green" 
              href="https://wa.me/5511999999999" 
              target="_blank"
            >
              <span className="mdi mdi-whatsapp"></span>
              <span>Whatsapp</span>
            </Button>
          </ButtonToolbar>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Adriano Hair Design. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;