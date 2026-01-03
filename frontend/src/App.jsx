import { Outlet } from 'react-router-dom'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default App
