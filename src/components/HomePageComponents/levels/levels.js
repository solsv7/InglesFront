import './levels.css';
import imgPr from '../../../images/ImgBR.png';
import imgEn from '../../../images/ImgEn.png';

const Niveles = () => {
    return(
        <div className="ContainerLevels">
            <div className='text'>
                <h2>Comienza a tu nivel</h2>
                <h4>Tu puedes elegir</h4>
                <div className='bar'></div>
            </div>
            <div className='Bloques'>
                <div className='BloqueLvL2'><h3 id='por'>Portugues</h3><h4>o</h4><h3 id='eng'>Ingles</h3></div>
                <div className='BloqueLvL3'><h3 id='por'>Portugues</h3><h4>o</h4><h3 id='eng'>Ingles</h3></div>
                <div className='BloqueLvL4'><h3 id='por'>Portugues</h3><h4>o</h4><h3 id='eng'>Ingles</h3></div>
            </div>
            <div className='ContImgs'>
                <img src={imgPr} id='ImagenPor' alt=''/>
                <img src={imgEn} id='ImagenEn' alt=''/>
            </div>
        </div>
    );
};

export default Niveles;