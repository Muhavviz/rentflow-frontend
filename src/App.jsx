import { useState } from 'react';
import { Link,Route,Routes } from 'react-router-dom';
import { useContext } from 'react';
import UserContext from './context/UserContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  const {isLoggedIn,handleLogout} = useContext(UserContext);

  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <nav className="p-4 border-b border-border flex justify-between items-center bg-white sticky top-0 z-50">
        <h1 className="text-xl font-bold text-primary">RentFlow</h1>
        <ul className="flex gap-4 items-center">
          <li><Link to='/' className="hover:underline">Home</Link></li>
          {(isLoggedIn || localStorage.getItem('token')) && (
            <>
              <li><Link to='/dashboard' className="hover:underline">Dashboard</Link></li>
              <li><Link to='/' onClick={() => handleLogout()} className="text-red-500 hover:underline">Logout</Link></li>
            </>
          )}
          {(!isLoggedIn && !localStorage.getItem('token')) && (
            <>
              <li><Link to='/register' className="text-sm">Register</Link></li>
              <li><Link to='/login' className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm">Login</Link></li>
            </>
          )}
        </ul>
      </nav>

      <div>
        <Routes>
          <Route path='/' element={<Home />}></Route>
          <Route path='/login' element={<Login />}></Route>
          <Route path='/register' element={<Register />}></Route>
          <Route path='/dashboard' element={isLoggedIn? <div className="p-10 text-2xl">Owner Dashboard (Locked)</div>:<Login />}></Route>
        </Routes>
      </div>
    </div>
  )
}

export default App