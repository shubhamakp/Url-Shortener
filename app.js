const express = require('express');
const app = express();
const connectDB = require('./config/db')
const port = 3000;
const validUrl = require('valid-url');
const shortid = require('shortid');
const config = require('config');
const ShortUrl = require('./models/url')
const path = require('path');

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')));
connectDB();

app.get('/', async (req, res) => {
    const shortUrls = await ShortUrl.find()
    res.render('index', { shortUrls: shortUrls })
  })

app.post('/shortUrls', async (req, res) => {

  const longUrl = req.body.fullUrl;
  const baseUrl = config.get('baseUrl');

  console.log(longUrl , baseUrl);
  // Check base url
  if (!validUrl.isUri(baseUrl)) {
    return res.status(401).json('Invalid base url');
  }

  // Create url code
  const urlCode = shortid.generate();

  // Check long url
  if (validUrl.isUri(longUrl)) {
    try {
      let url = await ShortUrl.findOne({ longUrl });

      if (url) {
          res.redirect('/');
      } else {
        const shorturl = baseUrl + '/' + urlCode;

        url = new ShortUrl({
            urlCode,
            longUrl,
            shorturl,
            date: new Date()
        });

        await url.save();

        res.redirect('/');
      }
    } catch (err) {
      console.error(err);
      res.status(500).json('Server error');
    }
  } else {
    res.status(401).json('Invalid long url');
  }
});
  

app.get('/:shortUrl', async (req, res) => {
    
    const shortUrl = await ShortUrl.findOne({ urlCode: req.params.shortUrl })
    console.log(shortUrl);
    if (shortUrl==null) {
      res.sendStatus(404);
    }  
    else
      res.redirect(shortUrl.longUrl)
  })

app.listen(port, () => console.log(`server started at ${port}`));