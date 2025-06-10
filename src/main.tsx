import { createRoot } from 'react-dom/client';
import { Auth0Provider } from "@auth0/auth0-react";
import { Domain, Client } from './helper.tsx';
import App from './App.tsx';
import './index.css';
import { CLIENT_BASE_2 } from './apis.tsx';

// console.log('--- Auth0Provider Setup Debug ---');
// console.log('VITE_AUTH0_DOMAIN (from code):', import.meta.env.VITE_AUTH0_DOMAIN);
// console.log('VITE_AUTH0_CLIENT (from code):', import.meta.env.VITE_AUTH0_CLIENT);
// console.log('Exported Domain:', Domain);
// console.log('Exported Client:', Client);
// console.log('Redirect URI (CLIENT_BASE_2):', CLIENT_BASE_2);
// console.log('---------------------------------');

const root = createRoot(document.getElementById("root")!);

root.render(
  <Auth0Provider
    domain={Domain}
    clientId={Client}
    authorizationParams={{
      redirect_uri: CLIENT_BASE_2,
      audience: "https://dev-kchfcftesqkpdp2z.us.auth0.com/api/v2/",
      scope: "openid profile email",
    }}
    cacheLocation="localstorage"
  >
    <App />
  </Auth0Provider>
);