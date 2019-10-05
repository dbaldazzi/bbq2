import express from 'express'
import RecipesService from '../services/RecipesService.js';
import {Authorize} from '../middleware/authorize.js'

let _recipesService = new RecipesService().repository

export default class RecipeController {
  constructor() {
    this.router = express.Router()
      //NOTE all routes after the authenticate method will require the user to be logged in to access

      .get('', this.getAll)
      .get('/:id', this.getById)
      .use(Authorize.authenticated)
      .post('', this.create)
      .put('/:id', this.edit)
      .delete('/:id', this.delete)
  }

  async getAll(req, res, next) {
    try {
      let data = await _recipesService.find({})
      return res.send(data)
    } catch (error) {
      next(error)
    }

  }

  async getById(req, res, next) {
    try {
      let data = await _recipesService.findById(req.params.id)
      if (!data) {
        throw new Error("Invalid Id")
      }
      res.send(data)
    } catch (error) {
      next(error)
    }
  }

  async create(req, res, next) {
    try {
      //NOTE the user id is accessable through req.body.uid, never trust the client to provide you this information
      req.body.authorId = req.session.uid
      let data = await _recipesService.create(req.body)
      res.send(data)
    } catch (error) {
      next(error)
    }
  }

  async edit(req, res, next) {
    try {
      let data = await _recipesService.findOneAndUpdate({
        _id: req.params.id,
      }, req.body, {
        new: true
      })
      if (data) {
        return res.send(data)
      }
      throw new Error("invalid id")
    } catch (error) {
      next(error)
    }
  }

  async delete(req, res, next) {
    try {
      await _recipesService.findOneAndRemove({
        _id: req.params.id
      })
      res.send("deleted value")
    } catch (error) {
      next(error)
    }

  }

}