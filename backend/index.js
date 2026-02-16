import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors({ origin: '*'}));

app.get('/api/login', (req, res) => {
  const { username, password } = req.query;

  if (username === 'admin' && password === 'admin') {
    res.json({ success: true, message: 'Login successful' });
  } else {
    res.json({ success: false, message: 'Invalid credentials' });
  }

  return res;
});

app.get('/api/checkIn', (req, res) => {
  const { username } = req.query;

  if (username) {
    res.json({ success: true, message: 'Check-in successful' });
  } else {
    res.json({ success: false, message: 'Username is required for check-in' });
  }

  return res;
});

app.get('/api/checkOut', (req, res) => {
  const { username } = req.query;

  if (username) {
    res.json({ success: true, message: 'Check-out successful' });
  } else {
    res.json({ success: false, message: 'Username is required for check-out' });
  }

  return res;
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});