
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './App.css'
import { useAuthStore } from './components/store/useAuthStore'
import Layout from './components/layout/Layout';
import Home from './components/pages/Home';
import ListingDetails from './components/pages/ListingDetails';
import Favorites from './components/pages/Favorites';
import Login from './components/pages/Login';
import Bookings from './components/pages/Bookings';

function ProtectedRoute ({children}: {children:React.ReactNode}) {
 const {isAuthenticated}=useAuthStore() ;
 return isAuthenticated? <>{children}</>:<Navigate to="/login" replace />
}
function App() {
 

  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />}></Route>
        <Route index element={<Home />}></Route>
        <Route path='listing/:id' element={<ListingDetails />}></Route>
        <Route path='favorite' element={<Favorites />}></Route>
        <Route path='login' element={<Login />}></Route>
        <Route path='bookings' element={
          <ProtectedRoute>
            <Bookings />
          </ProtectedRoute>
        }>

        </Route>
      </Routes>
      </BrowserRouter>
    </>
  );
}

export default App
