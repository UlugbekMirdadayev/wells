import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { Provider } from 'react-redux';
import { store } from 'redux/store';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <MantineProvider defaultColorScheme="dark">
        <Provider store={store}>
          <style>
            {`:root[data-mantine-color-scheme='dark'] {
                --mantine-color-body: var(--mantine-color-dark-8);
              }`}
          </style>
          <App />
        </Provider>
      </MantineProvider>
    </BrowserRouter>
  </React.StrictMode>
);
