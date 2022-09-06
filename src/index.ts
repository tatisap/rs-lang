import Cacher from './utils/cacher';
import App from './components/app';
import './style.scss';

new Cacher().preloadPictures();
new App().start();
