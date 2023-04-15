const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());
app.use(express.static('public'));

let nanoid;
import('nanoid').then(module => {
  nanoid = module.nanoid;
});

const urlSchema = new mongoose.Schema({
  shortId: { type: String, unique: true },
  originalUrl: { type: String, required: true }
});

const Url = mongoose.model('Url', urlSchema);

app.post('/shorten', async (req, res) => {
  const { originalUrl } = req.body;
  const shortId = nanoid(7);

  const newUrl = new Url({ shortId, originalUrl });
  await newUrl.save();

  res.json({ shortId });
});

app.get('/:shortId', async (req, res) => {
  const { shortId } = req.params;
  const url = await Url.findOne({ shortId });

  if (!url) {
    res.status(404).send('URL not found');
  } else {
    res.redirect(url.originalUrl);
  }
});

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/url-shortener';

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  })
  .catch((err) => console.error('Error connecting to MongoDB', err));
