import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Booking from './pages/Booking'
import Dashboard from './pages/Dashboard'
import Wishlist from './pages/Wishlist'
import Admin from './pages/Admin'
import MovieDetails from './pages/MovieDetails'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-paper font-sans text-ink transition-colors duration-300 dark:bg-midnight dark:text-slate-100">
          <Navbar />
          <main className="min-h-[calc(100vh-80px)]">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/movie/:movieName" element={<MovieDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
