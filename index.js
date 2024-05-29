import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { userRouter } from './Routes/users.js';
import { urlRouter } from './Routes/urls.js';
import { isAuthenticated } from './Authentication/userAuth.js';
import { getURL } from './Controllers/url.js';
import { dbConnection } from './db.js'; 

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

// Application middleware
app.use(express.json());
app.use(cors());

// Base routes
app.use('/user', userRouter);
app.use('/url', isAuthenticated, urlRouter);

app.get('/', (req, res) => {
  res.send({ msg: 'Connection working - URL shortener app' });
});

// URL redirection from short URL
app.get('/:urlID', async (req, res) => {
  try {
    const url = await getURL({ urlID: req.params.urlID });
    if (url) {
      console.log('Redirecting to long URL');
      return res.status(200).json({ longURL: url.longURL });
      // return res.redirect(url.longURL); // Uncomment this line to enable redirection
    } else {
      return res.status(404).json({ message: 'No URL Found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json('Server Error');
  }
});

// Ensure the database connection is established before starting the server
dbConnection().then(() => {
  app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
    console.log("URL Shortener");
  });
}).catch(err => {
  console.error('Failed to connect to the database. Server not started.', err);
});
