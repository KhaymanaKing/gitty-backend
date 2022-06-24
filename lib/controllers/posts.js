const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const { Post } = require('../models/Posts');

module.exports = Router ()
  .post('/', authenticate, async (req, res, next) => {
    try{
      const data = await Post.insert(req.body);
      res.json(data);
    } catch (e){
      next(e);
    }
  })  
  .get('/', authenticate, async (req, res, next) => {
    try{
      const data = await Post.getAll();
      res.json(data);
    } catch(e){
      next(e);
    }
  });
