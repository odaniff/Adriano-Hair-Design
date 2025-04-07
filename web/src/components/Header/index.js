import logoBranca from "../../assets/Adriano Hair Design (8).png";

const Header = () => {
    return (
        // container-fluid é uma classe do Bootstrap que cria um contêiner responsivo que ocupa toda a largura da tela
        // d-flex é uma classe do Bootstrap que aplica o display flex ao elemento
        //img-fluid é uma classe do Bootstrap que faz com que a imagem seja responsiva e se ajuste ao tamanho do contêiner
        <header className="container-fluid d-flex justify-content-between align-items-center p-2">
            <img src={logoBranca} id="logo" className="img-fluid px-3 py-4" alt="Logo"/>
            <div className="d-flex align-items-center">
                <div className="text-right mr-3">
                    <span className="d-block m-0 p-1 text-white">Adriano Hair Design</span>
                    <small className="m-0 p-1 text-white">Plano Gold</small>
                </div>
                <img id="foto_perfil" src="https://conteudo.imguol.com.br/c/entretenimento/d5/2020/10/07/homem-com-vergonha-1602098705397_v2_450x450.jpg" alt="foto-perfil"/>
                <span className="mdi mdi-chevron-down text-white"></span>
            </div>
      </header>
    );
};

export default Header;