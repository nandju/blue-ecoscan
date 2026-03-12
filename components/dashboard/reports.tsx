'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, FileSpreadsheet, Download, AlertCircle } from 'lucide-react'
import type { DetectedObject, AnalysisSummary } from '@/lib/types'
import { useAuth } from '@/lib/auth-context'

interface ReportsProps {
  objects: DetectedObject[]
  summary: AnalysisSummary | null
  imageUrl: string | null
}

export function Reports({ objects, summary, imageUrl }: ReportsProps) {
  const { user, settings } = useAuth()

  const generatePDFReport = () => {
    if (!summary || objects.length === 0) return

    // Generate HTML content for the report
    const reportHtml = `
<!DOCTYPE html>
<html>
<head>
  <title>BLUE EcoScan Report - ${new Date().toLocaleDateString()}</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 40px; color: #1a1a2e; }
    .header { text-align: center; margin-bottom: 40px; border-bottom: 3px solid #2563eb; padding-bottom: 20px; }
    .logo { font-size: 28px; font-weight: bold; color: #2563eb; }
    .subtitle { color: #666; margin-top: 8px; }
    .section { margin-bottom: 30px; }
    .section-title { font-size: 18px; font-weight: bold; color: #2563eb; margin-bottom: 16px; border-bottom: 1px solid #e5e5e5; padding-bottom: 8px; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .info-item { background: #f5f5f5; padding: 12px; border-radius: 8px; }
    .info-label { font-size: 12px; color: #666; }
    .info-value { font-size: 16px; font-weight: bold; }
    .summary-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
    .summary-card { text-align: center; padding: 16px; border-radius: 8px; }
    .summary-card.green { background: #dcfce7; color: #166534; }
    .summary-card.red { background: #fee2e2; color: #dc2626; }
    .summary-card.blue { background: #dbeafe; color: #2563eb; }
    table { width: 100%; border-collapse: collapse; margin-top: 16px; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e5e5e5; }
    th { background: #f5f5f5; font-weight: bold; }
    .badge { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 12px; }
    .badge-green { background: #dcfce7; color: #166534; }
    .badge-red { background: #fee2e2; color: #dc2626; }
    .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e5e5; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">BLUE EcoScan</div>
    <div class="subtitle">AI-Powered Waste Analysis Report</div>
  </div>

  <div class="section">
    <div class="section-title">Analysis Information</div>
    <div class="info-grid">
      <div class="info-item">
        <div class="info-label">Date</div>
        <div class="info-value">${new Date().toLocaleDateString()}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Location</div>
        <div class="info-value">${settings.defaultLocation || 'Not specified'}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Analyst</div>
        <div class="info-value">${user?.name || 'Unknown'}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Organization</div>
        <div class="info-value">${user?.organization || 'BLUE NGO'}</div>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Summary</div>
    <div class="summary-grid">
      <div class="summary-card blue">
        <div class="info-label">Total Objects</div>
        <div class="info-value">${summary.totalObjects}</div>
      </div>
      <div class="summary-card blue">
        <div class="info-label">Total Weight</div>
        <div class="info-value">${summary.totalWeight}g</div>
      </div>
      <div class="summary-card green">
        <div class="info-label">Recyclable</div>
        <div class="info-value">${summary.recyclableWeight}g</div>
      </div>
      <div class="summary-card red">
        <div class="info-label">Non-Recyclable</div>
        <div class="info-value">${summary.nonRecyclableWeight}g</div>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Detected Items</div>
    <table>
      <thead>
        <tr>
          <th>Object</th>
          <th>Brand</th>
          <th>Plastic Type</th>
          <th>Condition</th>
          <th>Weight</th>
          <th>Recyclable</th>
        </tr>
      </thead>
      <tbody>
        ${objects.map(obj => `
          <tr>
            <td>${obj.name}</td>
            <td>${obj.brand || 'Unknown'}</td>
            <td>${obj.plasticType}</td>
            <td>${obj.condition}</td>
            <td>${obj.estimatedWeight}g</td>
            <td><span class="badge ${obj.recyclable ? 'badge-green' : 'badge-red'}">${obj.recyclable ? 'Yes' : 'No'}</span></td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>

  <div class="footer">
    <p>Generated by BLUE EcoScan - AI-Powered Waste Analysis Platform</p>
    <p>Report generated on ${new Date().toLocaleString()}</p>
  </div>
</body>
</html>
    `

    // Open print dialog for PDF
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(reportHtml)
      printWindow.document.close()
      printWindow.print()
    }
  }

  const generateExcelReport = () => {
    if (!summary || objects.length === 0) return

    // Create CSV content
    const headers = ['Object', 'Brand', 'Plastic Type', 'Shape', 'Condition', 'Weight (g)', 'Recyclable']
    const rows = objects.map(obj => [
      obj.name,
      obj.brand || 'Unknown',
      obj.plasticType,
      obj.shape,
      obj.condition,
      obj.estimatedWeight.toString(),
      obj.recyclable ? 'Yes' : 'No'
    ])

    // Add summary rows
    rows.push([])
    rows.push(['Summary'])
    rows.push(['Total Objects', summary.totalObjects.toString()])
    rows.push(['Total Weight (g)', summary.totalWeight.toString()])
    rows.push(['Recyclable Weight (g)', summary.recyclableWeight.toString()])
    rows.push(['Non-Recyclable Weight (g)', summary.nonRecyclableWeight.toString()])

    const csvContent = [headers, ...rows]
      .map(row => row.join(','))
      .join('\n')

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `ecoscan-report-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  const hasData = objects.length > 0 && summary !== null

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          Reports
        </CardTitle>
        <CardDescription>
          Download scientific reports for your analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!hasData ? (
          <div className="text-center py-8 text-muted-foreground">
            <AlertCircle className="w-10 h-10 mx-auto mb-3 opacity-50" />
            <p>No data available for reports</p>
            <p className="text-sm">Analyze waste first to generate reports</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              Generate professional reports with all analysis data, charts, and statistics for environmental research.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="h-14 flex-col gap-1"
                onClick={generatePDFReport}
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  <span>PDF Report</span>
                </div>
                <span className="text-xs text-muted-foreground">For printing & sharing</span>
              </Button>
              <Button
                variant="outline"
                className="h-14 flex-col gap-1"
                onClick={generateExcelReport}
              >
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-accent" />
                  <span>Excel/CSV</span>
                </div>
                <span className="text-xs text-muted-foreground">For data analysis</span>
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
