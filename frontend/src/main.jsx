//import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { Toaster } from './components/ui/sonner.jsx';
import { Provider } from 'react-redux';
import store from './redux/store.js';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
const persistor =persistStore(store);

const token = document.cookie.split('token=')[1];
console.log('Token from cookies:', token);


// Suppress React Router future flag warnings in console
const consoleWarn = console.warn;
console.warn = (...args) => {
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('React Router Future Flag Warning'))
  ) {
    return;
  }
  consoleWarn(...args);
};

ReactDOM.createRoot(document.getElementById('root')).render(
  //<React.StrictMode> 
  <>
    <Provider store={store}>
      <PersistGate loading={null}persistor={persistor}>
      <App />
      </PersistGate>
    </Provider>
    <Toaster />
    </>
  //</React.StrictMode>
)

