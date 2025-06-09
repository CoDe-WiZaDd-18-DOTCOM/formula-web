import { createRoot } from 'react-dom/client'
import { Auth0Provider } from "@auth0/auth0-react"; 
import { Domain,Client } from './helper.tsx';
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(
    <Auth0Provider
      domain={Domain} 
      clientId={Client} 
      authorizationParams={{
        redirect_uri: "https://formula-web-seven.vercel.app/", 
        audience: "https://dev-sfiofywscwujl5yh.us.auth0.com/api/v2/",
      }}
      cacheLocation="localstorage"
    >
        <App />
    </Auth0Provider>
  );
