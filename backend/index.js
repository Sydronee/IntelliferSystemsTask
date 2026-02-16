import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());

app.get('/api/login', (req, res) => {
  const { username, password } = req.query;
//   password=bcrypt.hashSync(password, 10); // Send hashed password to the client for comparison

  if (username === 'admin' && password === bcrypt.hashSync('admin', 10)) {
    res.json({ success: true, message: 'Login successful' });
  } else {
    res.json({ success: false, message: 'Invalid credentials' });
  }

  return res;
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});