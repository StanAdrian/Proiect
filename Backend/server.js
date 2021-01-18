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
  
app.post('/add-self-as-tester', async (req, res) => {
    const { id: userId } = req.user
    const { projectId } = req.body
    const project = await ProjectsRepository.findById(projectId)
    if (project && !ProjectsRepository.isAlreadyMember(project, userId)) {
      project.addUser(await UsersRepository.findById(userId), { through: { role: 'TESTER' } })
      return res.status(200).send({ message: 'Added as tester to project' })
    }
    return res.status(401).send({ error: 'User is already member of project or project does not exist' })
  })
  
  app.post('/register-bug', async (req, res) => {
    const { id: registeringUserId } = req.user
    const { description, priority, severity, projectId, commitUrl } = req.body
    if ((await ProjectsRepository.getUserRole(projectId, registeringUserId)) === 'TESTER')
      return Bug.build({
        description,
        priority,
        severity,
        projectId,
        commitUrl,
        registeringUserId,
        status: 'CREATED',
      })
        .save()
        .then((bug) => {
          res.status(201).send(bug)
        })
        .catch((error) => {
          res.status(500).send(error)
        })
    return res.status(403).send({ error: 'User is not tester of project' })
  })
  
  app.get('/bugs/:projectId', async (req, res) => {
    const { id: userId } = req.user
    const { projectId } = req.params
    if ((await ProjectsRepository.getUserRole(projectId, userId)) === 'MP')
      return Bug.findAll({ where: { projectId } })
        .then((bugs) => res.status(200).send(bugs))
        .catch((err) => res.status(500).send(err))
    return res.status(403).send({ error: 'User is not MP of project' })
  })
  
const isMp = (projectId, userId) =>
ProjectsRepository.getUserRole(projectId, userId).then((role) => role === 'MP')

app.post('/assign-bug', async (req, res) => {
const { bugId } = req.body
const { id: userId } = req.user
const bug = await Bug.findByPk(bugId)
if (bug) {
  const { projectId, assignedUserId } = bug.dataValues
  if (!assignedUserId && (await isMp(projectId, userId))) {
    bug.assignedUserId = userId
    bug.status = 'ASSIGNED'
    return bug
      .save()
      .then((bug) => res.status(203).send(bug))
      .catch((err) => res.status(500).send(err))
  }
  return res.status(401).send({ error: 'Project does not exist or user is not MP' })
}
return res.status(401).send({ error: 'Bug id does not exist' })
})

app.post('/update-bug-status', async (req, res) => {
const { solveCommitUrl, bugId } = req.body
const { id: userId } = req.user
const bug = await Bug.findByPk(bugId)
if (bug) {
  const { projectId, status, assignedUserId } = bug.dataValues
  if (status === 'ASSIGNED' && assignedUserId === userId && (await isMp(projectId, userId))) {
    bug.solveCommitUrl = solveCommitUrl
    bug.status = 'SOLVED'
    return bug
      .save()
      .then((bug) => res.status(203).send(bug))
      .catch((err) => res.status(500).send(err))
  }
  return res.status(401).send({ error: 'Project does not exist or user is not MP' })
}
return res.status(401).send({ error: 'Bug id does not exist' })
})

app.listen(port, () => {
console.log(`Bugtracker api listening at http://localhost:${port}`)
})
