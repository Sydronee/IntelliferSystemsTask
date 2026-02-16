import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

const app = express();

app.use(cors());

const usersFile = path.join(process.cwd(), 'database', 'users.json');
const timesFile = path.join(process.cwd(), 'database', 'times.json');

app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// This checks if the user is allowed to enter (login)
app.get('/api/login', (req, res) => {
  const { username, password } = req.query;
  
  const users = JSON.parse(fs.readFileSync(usersFile, 'utf8'));

  let found = false;
  for (const id in users) {
    if (users[id].username === username && users[id].password === password) {
      found = true;
      break;
    }
  }

  if (found) {
    res.json({ success: true, message: 'Login successful' });
  } else {
    res.json({ success: false, message: 'Invalid credentials' });
  }
});

// This works like a punch card, user starts work
app.get('/api/checkIn', (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.json({ success: false, message: 'Username is required' });
  }

  let times = [];
  try {
      times = JSON.parse(fs.readFileSync(timesFile, 'utf8'));
  } catch (e) {
      times = [];
  }

  times.push({
      username: username,
      type: 'check-in',
      timestamp: new Date().toISOString()
  });

  fs.writeFileSync(timesFile, JSON.stringify(times, null, 2));

  res.json({ success: true, message: 'Check-in recorded' });
});

// This user is done for the day, punch out
app.get('/api/checkOut', (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.json({ success: false, message: 'Username is required' });
  }

  let times = [];
  times = JSON.parse(fs.readFileSync(timesFile, 'utf8'));

  times.push({
      username: username,
      type: 'check-out',
      timestamp: new Date().toISOString()
  });

  fs.writeFileSync(timesFile, JSON.stringify(times, null, 2));

  res.json({ success: true, message: 'Check-out recorded' });
});
// This gets all the times the user worked and calculates how many hours they worked each day

app.get('/api/getWorkingTimes', (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.json({ success: false, message: 'Username is required' });
  }

  let times = [];
  try {
      times = JSON.parse(fs.readFileSync(timesFile, 'utf8'));
  } catch (e) {
      times = [];
  }

  const userTimes = times.filter(t => t.username === username);

  const dailyHours = {};
  const dailyFlags = {};
  
  userTimes.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  let lastCheckInObj = null;

  userTimes.forEach(record => {
      const date = record.timestamp.split('T')[0];
      
      if (!dailyHours[date]) dailyHours[date] = 0;

      if (record.type === 'check-in') {
          if (lastCheckInObj) {
              const prevDate = lastCheckInObj.timestamp.split('T')[0];
              dailyFlags[prevDate] = (dailyFlags[prevDate] || 0) + 1;
          }
          lastCheckInObj = record;
      } else if (record.type === 'check-out') {
          if (lastCheckInObj) {
              const checkInTime = new Date(lastCheckInObj.timestamp);
              const checkOutTime = new Date(record.timestamp);
              const diffMs = checkOutTime - checkInTime;
              const diffHours = diffMs / (1000 * 60 * 60);
              
              const checkInDate = lastCheckInObj.timestamp.split('T')[0];
              if (!dailyHours[checkInDate]) dailyHours[checkInDate] = 0;
              dailyHours[checkInDate] += diffHours;
              
              lastCheckInObj = null;
          }
      }
  });
  
  // Check for currently open session (could be missing checkout if old)
  if (lastCheckInObj) {
      const date = lastCheckInObj.timestamp.split('T')[0];
      const today = new Date().toISOString().split('T')[0];
      if (date !== today) {
          dailyFlags[date] = (dailyFlags[date] || 0) + 1;
      }
  }

  res.json({ success: true, times: userTimes, dailyHours, dailyFlags });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});