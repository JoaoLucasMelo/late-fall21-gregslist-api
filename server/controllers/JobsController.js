import { Auth0Provider } from '@bcwdev/auth0provider'
import { jobsService } from '../services/JobsService'
import BaseController from '../utils/BaseController'

export class JobsController extends BaseController {
  constructor() {
    super('api/jobs')
    this.router
      .get('', this.getAll)
      .get('/:id', this.getById)
      .use(Auth0Provider.getAuthorizedUserInfo)
      .post('', this.createJob)
      .put('/:id', this.editJob)
      .delete('/:id', this.removeJob)
  }

  async getAll(req, res, next) {
    try {
      const query = req.query
      const job = await jobsService.getAll(query)
      res.send(job)
    } catch (error) {
      next(error)
    }
  }

  async getById(req, res, next) {
    try {
      const job = await jobsService.getById(req.params.id)
      res.send(job)
    } catch (error) {
      next(error)
    }
  }

  async createJob(req, res, next) {
    try {
      req.body.creatorId = req.userInfo.id
      const job = await jobsService.createJob(req.body)
      res.send(job)
    } catch (error) {
      next(error)
    }
  }

  async editJob(req, res, next) {
    try {
      req.body.creatorId = req.userInfo.id
      req.body.id = req.params.id
      const job = await jobsService.editJob(req.body)
      res.send(job)
    } catch (error) {
      next(error)
    }
  }

  async removeJob(req, res, next) {
    try {
      const userId = req.userInfo.id
      const jobId = req.params.id
      await jobsService.removeJob(jobId, userId)
      res.send('Job Deleted!')
    } catch (error) {
      next(error)
    }
  }
}
