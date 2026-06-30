const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'waitlist.json');

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Load existing waitlist or create empty array
function loadWaitlist() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error loading waitlist:', err);
  }
  return [];
}

// Save waitlist to file
function saveWaitlist(waitlist) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(waitlist, null, 2));
  } catch (err) {
    console.error('Error saving waitlist:', err);
  }
}

// API endpoint to get waitlist count
app.get('/api/waitlist/count', (req, res) => {
  const waitlist = loadWaitlist();
  res.json({ count: waitlist.length });
});

// API endpoint to join waitlist
app.post('/api/waitlist/join', (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  const waitlist = loadWaitlist();

  // Check if email already exists
  if (waitlist.includes(email)) {
    return res.status(409).json({ error: 'Email already on waitlist' });
  }

  // Add email to waitlist
  waitlist.push(email);
  saveWaitlist(waitlist);

  console.log(`New waitlist signup: ${email}`);
  res.json({ success: true, message: 'Successfully joined waitlist!' });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
