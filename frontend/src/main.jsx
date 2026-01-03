import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Dashboard from './pages/Dashboard.jsx'
import EmployeeDashboard from './pages/EmployeeDashboard.jsx'
import EmployeeProfile from './pages/EmployeeProfile.jsx'
import EmployeeAttendance from './pages/EmployeeAttendance.jsx'
import EmployeeLeave from './pages/EmployeeLeave.jsx'
import NotFound from './pages/NotFound.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'about',
        element: <About />,
      },
      {
        path: 'contact',
        element: <Contact />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'signup',
        element: <Signup />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'employee',
        children: [
          {
            path: '',
            element: <EmployeeDashboard />,
          },
          {
            path: 'profile',
            element: <EmployeeProfile />,
          },
          {
            path: 'attendance',
            element: <EmployeeAttendance />,
          },
          {
            path: 'leave',
            element: <EmployeeLeave />,
          },
        ],
      },
    ],
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
