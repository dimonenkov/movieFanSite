var express = require('express');
var router = express.Router();
const request = require('request');

const apiKey = '1fb720b97cc13e580c2c35e1138f90f8';
const apiBaseUrl = 'http://api.themoviedb.org/3';
const nowPlayingUrl = `${apiBaseUrl}/movie/now_playing?api_key=${apiKey}`;
const imageBaseUrl = 'http://image.tmdb.org/t/p/w300';
const imdbLink = 'https://www.imdb.com/title/';

router.use(function (req, res, next) {
  res.locals.imageBaseUrl = imageBaseUrl;
  res.locals.imdbLink = imdbLink;
  next();
});

/* GET home page. */
router.get('/', function (req, res, next) {
  request.get(nowPlayingUrl, function (err, response, movieData) {
    //console.log('======The error=====', err);
    //console.log(response);
    //console.log(movieData);
    const parsedData = JSON.parse(movieData);
    res.render('index', {
      parsedData: parsedData.results,
    });

    //res.json(parsedData);
  });
  //res.render('index', {});
});

router.get('/movie/:id', function (req, res, next) {
  //res.json(req.params.id);
  const movieId = req.params.id;
  const thisMovieUrl = `${apiBaseUrl}/movie/${movieId}?api_key=${apiKey}`;
  request.get(thisMovieUrl, function (err, response, movieData) {
    const parsedData = JSON.parse(movieData);
    res.render('single-movie', {
      parsedData: parsedData
    })
  });
});

router.post(('/search'), function (req, res, next) {
  //res.send('Sanity Check!');
  const userSearchTerm = encodeURI(req.body.movieSearch);//енкодва това, което търся в универсален формат.
  const cat = req.body.cat;
  const movieUrl = `${apiBaseUrl}/search/${cat}?query=${userSearchTerm}&api_key=${apiKey}`;
  //"http://api.themoviedb.org/3/search/movie?query=Lord Of The Rings&api_key=1fb720b97cc13e580c2c35e1138f90f8"
  // с encodeURI "http://api.themoviedb.org/3/search/movie?query=Lord%20Of%20The%20Rings&api_key=1fb720b97cc13e580c2c35e1138f90f8"
  request.get(movieUrl, function (err, response, movieData) {
    let parsedData = JSON.parse(movieData);
    //res.json(parsedData);
    if (cat === 'person') {
      parsedData.results = parsedData.results[1].known_for;
    }
    res.render('index', {
      parsedData: parsedData.results,
    })
  });
});

module.exports = router;
