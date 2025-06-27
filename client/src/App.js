import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import ForgotPass from './pages/Forgot';
import ResetPass from './pages/Reset'; 
import Home from './pages/Home';
import Admin from './pages/Admin';
import Partner from './pages/Partner';
import SingleMovie from './pages/Home/SingleMovie';
import BookShow from './pages/Home/BookShow';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import store from './redux/store';
import { Provider } from 'react-redux';

function App() {
  return (
    <div>
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPass />} />
            <Route path="/reset-password" element={<ResetPass />} />
            <Route path="/" element={ <ProtectedRoute><Home /></ProtectedRoute>}/>
            <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><Admin /></ProtectedRoute>} />
            <Route path="/partner" element={ <ProtectedRoute requiredRole="partner"><Partner /></ProtectedRoute>} />
            <Route path="/profile" element={ <ProtectedRoute requiredRole="user"><Profile /></ProtectedRoute>} />
            <Route path="/movie/:id"  element={ <ProtectedRoute><SingleMovie /></ProtectedRoute>  } />
            <Route path="/book-show/:id" element={ <ProtectedRoute><BookShow /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    </div>
  );
}

export default App;
