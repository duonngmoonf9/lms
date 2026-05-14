import 'bootstrap/dist/css/bootstrap.min.css';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './assets/style.scss';
import { AuthProvider } from './components/context/Auth.jsx';
NProgress.configure({
    showSpinner: false,
    trickleSpeed: 100,
});

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <AuthProvider>
            <App />
        </AuthProvider>

    </StrictMode>,
)
