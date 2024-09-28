import React from 'react';
import { Routes, Route } from "react-router-dom";
import Landing from '../components/landingpage';
import Layout from '../components/layout';
import Upload from '../components/upload';
import About from '../components/about_us';
import Download from '../components/Download';
import Login from '../components/login';
import { PrivateRoutes } from "../Route/PrivateRoutes"
import Profile from '../components/profile';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/about-us" element={<About />} />
      <Route path='/login' element={<Login />} />
      <Route element={<PrivateRoutes />}>
        <Route path='/home' element={<Layout />} />
        <Route path="/upload" element={<Upload />} />
        <Route path='/download' element={<Download />} />
        <Route path='/profile' element={<Profile />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
