
import React from 'react';
import ReactDOM from 'react-dom';

// core styles
import "./scss/volt.scss";

// vendor styles
import "leaflet/dist/leaflet.css";
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import "react-datetime/css/react-datetime.css";

import App from 'App';
import ApplicationContextProvider from 'contexts/ApplicationContext';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.render(
  <React.StrictMode>
    <ApplicationContextProvider>
      <BrowserRouter>
        <App/>
      </BrowserRouter>
    </ApplicationContextProvider>
  </React.StrictMode>
  , document.getElementById("root")
);
