import { dbContext } from '../db/DbContext'
import { BadRequest, Forbidden } from '../utils/Errors'

class JobsService {
  async getAll(query = {}) {
    const jobs = await dbContext.Jobs.find(query).populate('creator', 'name')
    return jobs
  }

  async getById(id) {
    const job = await dbContext.Jobs.findById(id).populate('creator', 'name')
    if (!job) {
      throw new BadRequest('No Jobs with this ID')
    }
    return job
  }

  async createJob(body) {
    const job = await dbContext.Jobs.create(body)
    return job
  }

  async editJob(body) {
    const job = await this.getById(body.id)
    if (job.creatorId.toString() !== body.creatorId) {
      throw new Forbidden('This is not your Post to edit!')
    }
    const update = await dbContext.Jobs.findOneAndUpdate({ _id: body.id, creatorId: body.creatorId }, body, { new: true })
    return update
  }

  async removeJob(jobId, userId) {
    const job = await this.getById(jobId)
    if (job.creatorId.toString() !== userId) {
      throw new Forbidden('This is not your Post to Delete')
    }
    await dbContext.Jobs.findByIdAndDelete(jobId)
    return job
  }
}
export const jobsService = new JobsService()
