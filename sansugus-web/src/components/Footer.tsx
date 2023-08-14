import '../styles/Footer.css'
import elephant from'../img/elephant.svg'
import insanz from '../img/insanz.svg'

function Footer(){

    return(
        <footer className='footer-main'>
            <div className="footer-item">
                <a href="https://www.elephantspain.com/"><img src={elephant} alt='Elephant Logo'/></a>
            </div>
            <div className="footer-item">
                <a href='https://ascensoresinsanz.wordpress.com/'><img src={insanz} alt="Insanz Logo" /></a>
            </div>
            <div className="footer-item"></div>
        </footer>
    )
}

export default Footer;