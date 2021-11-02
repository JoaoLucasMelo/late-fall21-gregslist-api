import { dbContext } from '../db/DbContext'
import { BadRequest, Forbidden } from '../utils/Errors'

class HousesServices {
  async getAll(query = {}) {
    const houses = await dbContext.Houses.find(query).populate('creator', 'name')
    return houses
  }

  async getById(id) {
    const houses = await dbContext.Houses.findById(id).populate('creator', 'name')
    if (!houses) {
      throw new BadRequest('House id Invalid')
    }
    return houses
  }

  async createHouse(body) {
    const house = await dbContext.Houses.create(body)
    return house
  }

  async editHouse(body) {
    const house = await this.getById(body.id)
    if (house.creatorId.toString() !== body.creatorId) {
      throw new Forbidden('This is not your House to edit!')
    }
    const update = dbContext.Houses.findOneAndUpdate({ _id: body.id, creatorId: body.creatorId }, body, { new: true })
    return update
  }

  async removeHouse(houseId, userId) {
    const house = await this.getById(houseId)
    if (house.creatorId.toString() !== userId) {
      throw new Forbidden('This is not your House to sell!')
    }
    await dbContext.Houses.findByIdAndDelete(houseId)
  }
}

export const housesService = new HousesServices()
