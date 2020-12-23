const express = require('express')
const cors = require('cors')
const jwt = require('express-jwt')
const bcrypt = require('bcryptjs')
const { secret } = require('./config.js').jwt
const app = express()
const port = 3000

const { UsersRepository, ProjectsRepository } = require('./repositories')
const { Bug } = require('./models')
const { JwtService } = require('./services')

app.use(jwt({ secret, algorithms: ['HS256'] }).unless({ path: ['/login', '/register'] }))
app.use(cors())
app.use(express.json())

const _getPayload = ({ dataValues: { email, id } }) => ({ email, id })

app.post('/login', async (req, res) => {
  const { email, password } = req.body
  const user = await UsersRepository.findOne(email)
  if (user) {
    const isValid = await bcrypt.compare(password, user.dataValues.password)
    if (isValid) return res.status(200).send({ token: JwtService.sign(_getPayload(user)) })
  }
  return res.status(401).send({ error: 'Invalid email/password' })
})

app.post('/register', (req, res) => {
  const { email, password } = req.body
  return UsersRepository.save({ email, password })
    .then((user) => res.status(201).send({ token: JwtService.sign(_getPayload(user)) }))
    .catch((err) => res.status(500).send({ error: err.message }))
})

app.get('/projects', (req, res) => {
    return ProjectsRepository.findAll()
      .then((projects) => res.status(200).send(projects))
      .catch((err) => res.status(500).send(err))
  })
  
  app.get('/users', (req, res) => {
    return UsersRepository.findAll()
      .then((users) => res.status(200).send(users))
      .catch((err) => res.status(500).send(err))
  })
  
  app.post('/create-project', (req, res) => {
    const { id: userId } = req.user
    const { repoUrl, userIds = [] } = req.body
    return ProjectsRepository.save({ repoUrl })
      .then(async (project) => {
        const through = { through: { role: 'MP' } }
        await project.addUser(await UsersRepository.findById(userId), through)
        return Promise.all(
          userIds.map(async (userId) => project.addUser(await UsersRepository.findById(userId), through))
        )
      })
      .then(() => res.status(201).send({ message: 'Project created' }))
      .catch(({ message: error }) => res.status(500).send({ error }))
  })