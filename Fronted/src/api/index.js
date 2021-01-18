import axios from 'axios'

export default () => {
  const options = {
    baseURL: 'http://localhost:3000/',
    headers: {
      Authorization: `Bearer ${localStorage.jwt}`,
    },
  }
  return axios.create(options)
}
