const express = require('express');
const app = express();
const connectDB = require('./config/db')
const port = 3000;
const validUrl = require('valid-url');
const shortid = require('shortid');
const config = require('config');
const ShortUrl = require('./models/url')
const path = require('path');
var m = require('memory-cache');
var capacity = 100;

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

  console.log(longUrl, baseUrl);
  // Check base url
  if (!validUrl.isUri(baseUrl)) {
    return res.status(401).json('Invalid base url');
  }

  // Create url code
  var urlCode = shortid.generate();
  let generatedCode = ShortUrl.findOne({ urlCode });
    while(generatedCode==null) {
    urlCode = shortid.generate();
    generatedCode = ShortUrl.findOne({ urlCode });
  }

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

  var key = req.params.shortUrl;
  var isP = m.get(key)
  console.log(isP)
  if (isP != null) //remove it and add it back with new value
  {
    console.log("ISp");
    m.del(key);
    m.put(key, isP);
    res.redirect(isP)

  }
  else {
    const shortUrl = await ShortUrl.findOne({ urlCode: req.params.shortUrl });
    var value = "";
    if (!(shortUrl.longUrl == null))
      value = shortUrl.longUrl;

    if (shortUrl == null) {
      console.log("map worked fine");
      res.sendStatus(404);
    }
    else if (m.size() == capacity) //remove the first key (Map adds new keys to the back)
    {
      var first_key = m.keys()[0];
      console.log(first_key)
      m.del(first_key);
      m.put(key, value);
      console.log("full");
      res.redirect(value);

    }
    else {
      console.log("added in map and redirected")
      m.put(key, value);
      console.log(capacity);
      console.log(m.size());
      res.redirect(value)
    }
  }
})

app.listen(port, () => console.log(`server started at ${port}`));