import { createRoot } from 'react-dom/client'
import { Auth0Provider } from "@auth0/auth0-react"; 
import { Domain,Client } from './helper.tsx';
import App from './App.tsx'
import './index.css'
import { CLIENT_BASE, CLIENT_BASE_2 } from './apis.tsx';

createRoot(document.getElementById("root")!).render(
    <Auth0Provider
      domain={Domain} 
      clientId={Client} 
      authorizationParams={{
        redirect_uri: CLIENT_BASE_2, 
        audience: "https://dev-kchfcftesqkpdp2z.us.auth0.com/api/v2/",
      }}
      cacheLocation="localstorage"
    >
        <App />
    </Auth0Provider>
  );
