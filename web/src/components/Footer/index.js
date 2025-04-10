import React from 'react';
import { Button, ButtonToolbar } from 'rsuite';

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-section about">
          <h3 className="footer-title">Adriano Hair Design</h3>
          <p className="footer-text">Transformando seu visual com excelência desde 2007.</p>
          
          <div className="contact-info">
            <div className="contact-item">
              <span className="mdi mdi-map-marker-outline"></span>
              <span>Asa Norte Comércio Local Norte 113 - Asa Norte, Brasília - DF, 70297-400</span>
            </div>
            <div className="contact-item">
              <span className="mdi mdi-clock-outline"></span>
              <span>Ter-Sáb: 8h-18h</span>
            </div>
            <div className="contact-item">
              <span className="mdi mdi-phone"></span>
              <span>(61) 98201-0245</span>
            </div>
            <div className="contact-item">
              <span className="mdi mdi-email-outline"></span>
              <span>hairadriano2625@gmail.com</span>
            </div>
          </div>
        </div>

        <div className="footer-section links">
          <h3 className="footer-title">Links Rápidos</h3>
          <ul>
            <li><a href="https://wa.me/5561982010245">Contato</a></li>
          </ul>
        </div>

        <div className="footer-section social">
          <h3 className="footer-title">Redes Sociais</h3>
          <ButtonToolbar className="social-buttons">
            <Button 
              appearance="subtle" 
              color="red" 
              href="https://www.instagram.com/hairadriano2625/" 
              target="_blank"
            >
              <span className="mdi mdi-instagram"></span>
              <span>Instagram</span>
            </Button>
            <Button 
              appearance="subtle" 
              color="green" 
              href="https://wa.me/5561982010245" 
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