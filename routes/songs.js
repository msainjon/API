const router = require('express').Router();
const SongService = require('../services/SongService');

router.post('/', (req, res) => {
  return SongService.create(req.body)
    .then(song => {
      if (!song) {
          return res.status(404).send({err: `id ${req.params.id} not found`});
      }
      if (req.accepts('text/html')) {
          return res.redirect('/songs/' + song.id);
      }
      if (req.accepts('application/json')) {
          return res.status(200).send(song);
      }
    })
    .catch(err => {
      res.status(500).send(err);
    })
  ;
});

router.get('/', (req, res) => {
  SongService.find(req.query)
    .then(songs => {
      if (req.accepts('text/html')) {
          return res.render('songs', {songs: songs});
      }
      if (req.accepts('application/json')) {
          return res.status(200).send(songs);
      }
    })
  ;
});

router.get('/add/', (req, res) => {
  res.render('new');
});

router.put('/:id', (req, res, next) => {
    SongService.updateById(req.params.id, req.body)
        .then(result => {
            if (req.accepts('text/html')) {
                return res.redirect('/songs/' + req.params.id);
            }
            if (req.accepts('application/json')) {
                return res.status(201).send(result);
            }
        })
        .catch(next);
});

router.get('/edit/:id', (req, res) => {
  SongService.findOneByQuery({id: req.params.id}).then(song => {
    return res.render('edit', {song: song});
  });
});

router.get('/:id', (req, res) => {
  if (!req.accepts('text/html') && !req.accepts('application/json')) {
       return res.status(406).send({err: 'Not valid type for asked resource'});
   }
   SongService.findOneByQuery({id: req.params.id}).then(song => {
           if (!song) {
               return res.status(404).send({err: `id ${req.params.id} not found`});
           }
           if (req.accepts('text/html')) {
               return res.render('song', {song: song});
           }
           if (req.accepts('application/json')) {
               return res.status(200).send(song);
           }
  });
});

router.delete('/delete/:id', (req, res) => {
  SongService.delete(req.params.id)
    .then(song => {
      res.status(204).send();
    })
  ;
});

router.get('/artiste/:artiste', (req, res) => {
  SongService.findByArtiste(req.params.artiste)
    .then(songs => {
      res.status(200).send(songs);
    })
    .catch(err => { res.status(500).send(error)})
  ;
});

module.exports = router;
