import React, { useEffect, useState } from 'react'

export const Dashboard = ({ username }) => {
  const [dailyData, setDailyData] = useState({})
  const [flags, setFlags] = useState({})

  const fetchTimes = () => {
    fetch(`http://localhost:3000/api/getWorkingTimes?username=${username}`)
      .then(res => res.json())
      .then(d => {
        if (d.success) {
            setDailyData(d.dailyHours || {})
            setFlags(d.dailyFlags || {})
        }
      })
  }

  useEffect(() => {
    fetchTimes()
  }, [username])

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      backgroundColor: 'white', 
      color: 'black', 
      width: '100vw', 
      height: '100vh',
      position: 'fixed',
      top: 0,
      left: 0
    }}>
      <h1>Welcome {username}</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => {
            fetch(`http://localhost:3000/api/checkIn?username=${username}`)
            .then(response => response.json())
            .then(data => {
              alert(data.message)
              fetchTimes()
            })
        }}>Check In</button>
        <button onClick={() => {
          fetch(`http://localhost:3000/api/checkOut?username=${username}`)
            .then(response => response.json())
            .then(data => {
              alert(data.message)
              fetchTimes()
            })
        }}>Check Out</button>
      </div>

      <div>
        <h3>Total Hours Per Day</h3>
        <ul>
          {Object.entries(dailyData).map(([date, hours]) => (
            <li key={date}>
              <strong>{date}:</strong> {Number(hours).toFixed(2)} hrs
              {flags && flags[date] ? <span> Missing Check-out</span> : null}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
