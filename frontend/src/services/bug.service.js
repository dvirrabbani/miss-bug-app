import axios from "axios"

const BASE_URL = "/api/bug"
export const bugService = {
  query,
  getById,
  save,
  remove,
  getFilterFromParams,
}

async function query(filterBy) {
  if (filterBy.severity === 0) {
    delete filterBy.severity
  }
  const { data: bugs } = await axios.get(`${BASE_URL}/`, { params: filterBy })
  return bugs
}
async function getById(bugId) {
  const { data: bug } = await axios.get(`${BASE_URL}/${bugId}`)
  return bug
}
async function remove(bugId) {
  return axios.get(`${BASE_URL}/${bugId}/remove`)
}
async function save(bug) {
  const { title, severity, _id } = bug
  let searchParams = _paramsSerializer({ title, severity, _id })

  const { data: bugToSave } = await axios.get(
    `${BASE_URL}/save?${searchParams}`
  )

  return bugToSave
}

function getDefaultFilter() {
  return {
    title: "",
    severity: "",
  }
}

function getFilterFromParams(searchParams) {
  const defaultFilter = getDefaultFilter()
  const filterBy = {}

  for (const field in defaultFilter) {
    filterBy[field] = searchParams.get(field) || defaultFilter[field]
  }
  return filterBy
}

function _paramsSerializer(params) {
  return Object.keys(params)
    .map((key) => {
      if (params[key] !== undefined) {
        return `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
      }
    })
    .join("&")
}
