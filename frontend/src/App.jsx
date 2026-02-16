import { useState } from 'react'
import './App.css'
import { Dashboard } from './dashboard'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleLogin = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/login?username=${username}&password=${password}`
      )
      const data = await response.json()
      alert(data.message)
      if (data.success) {
        setIsLoggedIn(true)
      }
    } catch (error) {
      console.error('Error during login:', error)
    }
  } 

  if (isLoggedIn) {
     return <Dashboard username={username} />
  }

  return (
    <div className='loginBox'>
      <label htmlFor="username">Username</label>
      <input
        id="username"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <label htmlFor="password">Password</label>
      <input
        id="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  )
}

export default App;