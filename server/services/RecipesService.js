import mongoose from "mongoose"
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const _model = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  ingredients: {
    type: String,
    required: true
  },
  instructions: {
    type: String,
    required: true
  },
  authorId: {
    type: ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
})

export default class RecipesService {
  get repository() {
    return mongoose.model('recipes', _model)
  }
}