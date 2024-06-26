import Axios from "axios"

var axios = Axios.create({
  withCredentials: true,
  baseURL:
    window.location.hostname === "localhost"
      ? "http://localhost:3030/api/bug"
      : "/api/bug",
})

export const bugService = {
  query,
  getById,
  save,
  remove,
  getFilterFromParams,
}

async function query(filterBy = {}) {
  const { data: bugs } = await axios.get("/", { params: filterBy })
  return bugs
}

async function getById(bugId) {
  const { data: bug } = await axios.get(`/${bugId}`)
  return bug
}

async function remove(bugId) {
  return axios.delete(`/${bugId}`)
}

async function save(bug) {
  const method = bug._id ? "put" : "post"
  const { data: savedBug } = await axios[method](bug._id || "", bug)

  return savedBug
}

function getDefaultFilter() {
  return {
    txt: "",
    minSeverity: 0,
    labels: [],
    pageIdx: 1,
    perPage: 3,
  }
}

function getFilterFromParams(searchParams) {
  const defaultFilter = getDefaultFilter()
  const filterBy = {}

  for (const field in defaultFilter) {
    let val = searchParams.get(field) || defaultFilter[field]
    if (typeof defaultFilter[field] === "number") {
      val = +val
    }
    filterBy[field] = val
  }
  return filterBy
}
