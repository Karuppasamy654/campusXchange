import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Resources from './pages/Resources';
import ResourceDetails from './pages/ResourceDetails';
import CreateResource from './pages/CreateResource';
import StudyMaterials from './pages/StudyMaterials';
import MapPage from './pages/Map';
import DatabaseLab from './pages/DatabaseLab';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col justify-between bg-slate-50">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/resources/create" element={<CreateResource />} />
            <Route path="/resources/:id" element={<ResourceDetails />} />
            <Route path="/study-materials" element={<StudyMaterials />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/database-lab" element={<DatabaseLab />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
