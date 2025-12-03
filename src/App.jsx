
import {Route,Routes,Navigate } from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ChangePassword from './pages/ChangePassword';
import DashboardLayout from './components/DashboardLayout';
import Overview from './pages/dashboard/Overview';
import Buildings from './pages/dashboard/Buildings'
import BuildingDetails from './pages/dashboard/BuildingDetails';
import MyHome from './pages/tenant/MyHome';
import TenantLayout from './pages/dashboard/TenantLayout';
import ProtectedRoute from './components/ProtectedRoute';

function App() {


  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      

      
        <Routes>
          <Route path='/' element={<Home />}></Route>
          <Route path='/login' element={<Login />}></Route>
          <Route path='/register' element={<Register />}></Route>
          <Route path='/change-password' element={<ChangePassword />}></Route>
          <Route path='/dashboard' element={<ProtectedRoute allowedRoles={['owner','admin']}><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<Overview />} />
          <Route path='buildings' element={<Buildings />} />
          <Route path='buildings/:id' element={<BuildingDetails />}/>
          <Route path='tenants' element={<div className="text-2xl font-bold">Tenants List (Coming Soon)</div>} />
          <Route path='agreements' element={<div className="text-2xl font-bold">Agreements List (Coming Soon)</div>} />
          </Route>

          <Route path='/tenant' element={
            <ProtectedRoute allowedRoles={['tenant']}>
                <TenantLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/tenant/home" replace />} />
            <Route path='home' element={<MyHome />} />
            <Route path='agreement' element={<div className="text-2xl font-bold">My Agreement (Coming Soon)</div>} />
          </Route>
        </Routes>
      
    </div>
  )
}

export default App