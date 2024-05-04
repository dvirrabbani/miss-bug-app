import { Document, Page, Text } from "@react-pdf/renderer"

export function BugsPdfDocument(bugs) {
  return (
    <Document>
      <Page>
        <Text>Bugs</Text>
        {bugs.map((bug) => {
          return (
            <Text
              key={bug._id}
              style={{ fontSize: "14px", marginTop: "8px", padding: "8px" }}
            >
              Bug - Id: {bug._id}, Title: {bug.title}, Severity:
              {bug.severity}
            </Text>
          )
        })}
      </Page>
    </Document>
  )
}
