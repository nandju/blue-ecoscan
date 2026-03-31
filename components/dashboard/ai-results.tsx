'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Sparkles, Recycle, Scale, Package, AlertCircle, Leaf } from 'lucide-react'
import type { DetectedObject, AnalysisSummary } from '@/lib/types'

interface AIResultsProps {
  objects: DetectedObject[]
  summary: AnalysisSummary | null
}

function getConditionColor(condition: DetectedObject['condition']) {
  switch (condition) {
    case 'Good':
      return 'bg-accent text-accent-foreground'
    case 'Average':
      return 'bg-chart-4/20 text-chart-4'
    case 'Poor':
      return 'bg-warning/20 text-warning-foreground border border-warning/30'
    case 'Critical':
      return 'bg-destructive/20 text-destructive'
    default:
      return 'bg-muted text-muted-foreground'
  }
}

export function AIResults({ objects, summary }: AIResultsProps) {
  if (objects.length === 0) {
    return (
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            AI Results
          </CardTitle>
          <CardDescription>
            Detected objects will appear here after analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No analysis results yet</p>
            <p className="text-sm">Upload and analyze an image to see results</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          AI Results
        </CardTitle>
        <CardDescription>
          {objects.length} object{objects.length !== 1 ? 's' : ''} detected in the image
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-muted rounded-xl p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Package className="w-4 h-4" />
                <span className="text-xs font-medium">Total Objects</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{summary.totalObjects}</p>
            </div>
            <div className="bg-muted rounded-xl p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Scale className="w-4 h-4" />
                <span className="text-xs font-medium">Total Weight</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{summary.totalWeight}g</p>
            </div>
            <div className="bg-accent/10 rounded-xl p-4">
              <div className="flex items-center gap-2 text-accent mb-1">
                <Recycle className="w-4 h-4" />
                <span className="text-xs font-medium">Recyclable</span>
              </div>
              <p className="text-2xl font-bold text-accent">{summary.recyclableWeight}g</p>
            </div>
            <div className="bg-destructive/10 rounded-xl p-4">
              <div className="flex items-center gap-2 text-destructive mb-1">
                <AlertCircle className="w-4 h-4" />
                <span className="text-xs font-medium">Non-Recyclable</span>
              </div>
              <p className="text-2xl font-bold text-destructive">{summary.nonRecyclableWeight}g</p>
            </div>
          </div>
        )}

        {/* Detected Objects List */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm text-muted-foreground">Detected Items</h4>
          <div className="space-y-2">
            {objects.map((obj) => (
              <div
                key={obj.id}
                className="bg-muted/50 rounded-xl p-4 border border-border/50"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h5 className="font-semibold text-foreground truncate">{obj.name}</h5>
                    <p className="text-sm text-muted-foreground">
                      {obj.brand || 'Unknown brand'} • {obj.shape}
                    </p>
                  </div>
                  <Badge className={obj.recyclable ? 'bg-accent text-accent-foreground' : 'bg-destructive/20 text-destructive'}>
                    {obj.recyclable ? 'Recyclable' : 'Non-Recyclable'}
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <Badge variant="outline" className="text-xs">
                    {obj.plasticType}
                  </Badge>
                  <Badge className={`text-xs ${getConditionColor(obj.condition)}`}>
                    {obj.condition}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    ~{obj.estimatedWeight}g
                  </Badge>
                </div>
                <div className="mt-3 flex items-start gap-2">
                  <Leaf className="w-3 h-3 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-muted-foreground leading-relaxed">{obj.impact}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
