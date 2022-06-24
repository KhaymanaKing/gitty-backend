const { Router } = require('express');
const { Post } = require('../models/Posts');

module.exports = Router ()
  .get('/', async (req, res, next) => {
    try{
      const data = await Post.getAll();
      res.json(data);
    } catch(e){
      next(e);
    }
  });
