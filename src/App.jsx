import { useState } from 'react';
import {Route,Routes,Navigate } from 'react-router-dom';
import { useContext } from 'react';
import UserContext from './context/UserContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ChangePassword from './pages/ChangePassword';
import DashboardLayout from './components/DashboardLayout';
import Overview from './pages/dashboard/Overview';
import Buildings from './pages/dashboard/Buildings'
import BuildingDetails from './pages/dashboard/BuildingDetails';

function App() {
  const {isLoggedIn} = useContext(UserContext);

  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      

      
        <Routes>
          <Route path='/' element={<Home />}></Route>
          <Route path='/login' element={<Login />}></Route>
          <Route path='/register' element={<Register />}></Route>
          <Route path='/change-password' element={<ChangePassword />}></Route>
          <Route path='/dashboard' element={isLoggedIn || localStorage.getItem('token') ? <DashboardLayout /> :<Navigate to='/login' />}>
          <Route index element={<Overview />} />
          <Route path='buildings' element={<Buildings />} />
          <Route path='buildings/:id' element={<BuildingDetails />}/>
          <Route path='tenants' element={<div className="text-2xl font-bold">Tenants List (Coming Soon)</div>} />
          <Route path='agreements' element={<div className="text-2xl font-bold">Agreements List (Coming Soon)</div>} />
          </Route>
        </Routes>
      
    </div>
  )
}

export default App