export function Pagination({ current, total, onChange }) {
  function renderPageList() {
    const pageList = []
    for (let i = 1; i <= total; i++) {
      pageList.push(
        <li key={i} className={i === current ? "active" : ""}>
          <button onClick={() => onChange(i)}>{i}</button>
        </li>
      )
    }
    return pageList
  }

  return (
    <section className="pagination">
      <ul className="clean-list flex">{renderPageList()}</ul>
    </section>
  )
}
