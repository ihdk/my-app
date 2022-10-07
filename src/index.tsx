import ReactDOM from 'react-dom/client';

import 'react-toastify/dist/ReactToastify.min.css';
import '@fontsource/montserrat/300.css';
import '@fontsource/montserrat/400.css';
import '@fontsource/montserrat/600.css';
import '@fontsource/montserrat/900.css';

import App from './App';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(<App />);