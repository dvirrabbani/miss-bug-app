export function Pagination({ current, total, onPageChange }) {
  const pageIdxList = Array(total)
    .fill()
    .map((_, index) => index + 1)

  return (
    <section className="pagination">
      <ul className="clean-list flex">
        {pageIdxList.map((pageIdx) => {
          return (
            <li key={pageIdx} className={pageIdx === current ? "active" : ""}>
              <button onClick={() => onPageChange(pageIdx)}>{pageIdx}</button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
