var Article  = require('../models/article');
var express = require('express');
var router  = express.Router();

router.get('/', function(req, res) {
  Article.findAll()
    .then(function(articles) {
      res.render('articles', { title: 'Noticias', articles: articles });
    });
});

//curl -H "Content-Type: application/json" -X POST -d '{"title": "untitulo", "subtitle":"unSubtitulo", "content":"uncontendido","AuthorId":"2"}' http://localhost:8080/articles/create

router.post('/create', function(req, res) {
  Article.create(req.body)
  .then(function(article) {
    res.redirect('/articles');
  });
});

router.get('/:article_id', function(req, res) {
  Article
    .find({
      where: {id: req.params.article_id}
    })
    .then(function(article) {
      if (article) res.send(article);
      else {
        res.status(400);
        res.json({'Message:':'Author not found'});
      }
    });
});

router.get('/:article_id/destroy', function(req, res) {
  Article.destroy({
    where: {id: req.params.article_id}
  })
  .then(function() {
      res.redirect('/articles');
    });
});

module.exports = router;