import { PDFDownloadLink } from "@react-pdf/renderer"
import { BugsPdfDocument } from "./bug/BugsPdfDocument"

export function PDFDownloader() {
  return (
    <PDFDownloadLink
      document={<BugsPdfDocument />}
      fileName="missBugsReview.pdf"
    >
      <button>Download as PDF</button>
    </PDFDownloadLink>
  )
}
