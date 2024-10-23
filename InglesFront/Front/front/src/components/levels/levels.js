import './levels.css'
import { Fade} from 'react-reveal';

const Niveles = () => {
    return(
        <div className="Container">
        <Fade>
            <div className='text'>
                <h2>¡Classes for each Level!</h2>
            </div>
        </Fade>
            
            
            <div className='Wrapper'>
                <div className='Container-de-Wrapper'>
                    <input type='radio' name='slide' id='c1'></input>
                    <label for="c1" className='card'>
                        <div className='row'>
                            <div className='icon'>A1</div>
                            <div className='description'>
                                <h4> Beginner/Elementary</h4>
                            </div>
                        </div>
                    </label>
                    <input type='radio' name='slide' id='c2' ></input>
                    <label for="c2" className='card'>
                        <div className='row'>
                            <div className='icon'>A2</div>
                            <div className='description'>
                                <h4>Pre Intermediate</h4>
                            </div>
                        </div>
                    </label>
                    <input type='radio' name='slide' id='c3'></input>
                    <label for="c3" className='card'>
                        <div className='row'>
                            <div className='icon'>B1</div>
                            <div className='description'>
                                <h4>Intermediate</h4>
                            </div>
                        </div>
                    </label>
                    <input type='radio' name='slide' id='c4' ></input>
                    <label for="c4" className='card'>
                        <div className='row'>
                            <div className='icon'>B2</div>
                            <div className='description'>
                                <h4>Upper Intermediate</h4>
                            </div>
                        </div>
                    </label>
                    <input type='radio' name='slide' id='c5'></input>
                    <label for="c5" className='card'>
                        <div className='row'>
                            <div className='icon'>C1</div>
                            <div className='description'>
                                <h4>Advanced</h4>
                            </div>
                        </div>
                    </label>
                    <input type='radio' name='slide' id='c6'></input>
                    <label for="c6" className='card'>
                        <div className='row'>
                            <div className='icon'>C2</div>
                            <div className='description'>
                                <h4>Proeficient</h4>
                            </div>
                        </div>
                    </label>
                </div>
            </div>
            
        </div>
    );
};

export default Niveles;