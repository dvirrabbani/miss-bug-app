import { PDFDownloadLink } from "@react-pdf/renderer"
import { BugsPdfDocument } from "./BugsPdfDocument"

export function PDFDownloader({ bugs }) {
  return (
    <PDFDownloadLink
      document={<BugsPdfDocument bugs={bugs} />}
      fileName="missBugsReview.pdf"
    >
      <button disabled={!bugs?.length}>Download as PDF</button>
    </PDFDownloadLink>
  )
}
