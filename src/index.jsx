import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css';
import App from './App';
import Kurz from './Kurz';
import Sbirka from './Sbirka';
import Lekce from './Lekce';
import NotFound from './NotFound';
import Login from './Login';
import Logout from './Logout';
import Register from './Register';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/kurz" element={<Kurz />} />
        <Route path="/kurz/:id" element={<Sbirka />} />
        <Route path="/kurz/:id/:idlekce" element={<Lekce />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
