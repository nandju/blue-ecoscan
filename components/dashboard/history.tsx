'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { History, MapPin, Calendar, Package, Scale, ChevronDown, ChevronUp, ImageIcon } from 'lucide-react'
import type { Analysis } from '@/lib/types'

interface HistoryProps {
  analyses: Analysis[]
}

export function AnalysisHistory({ analyses }: HistoryProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  if (analyses.length === 0) {
    return (
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5 text-primary" />
            Analysis History
          </CardTitle>
          <CardDescription>
            Your previous analyses will appear here
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <History className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No previous analyses</p>
            <p className="text-sm">Completed analyses will be saved here</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="w-5 h-5 text-primary" />
          Analysis History
        </CardTitle>
        <CardDescription>
          {analyses.length} previous analysis{analyses.length !== 1 ? 'es' : ''}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {analyses.map((analysis) => (
          <div
            key={analysis.id}
            className="bg-muted/50 rounded-xl border border-border/50 overflow-hidden"
          >
            <button
              className="w-full p-4 flex items-center gap-4 text-left hover:bg-muted/80 transition-colors"
              onClick={() => setExpandedId(expandedId === analysis.id ? null : analysis.id)}
            >
              {/* Thumbnail */}
              <div className="w-16 h-16 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                {analysis.imageUrl ? (
                  <img 
                    src={analysis.imageUrl} 
                    alt="Analysis thumbnail" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-6 h-6 text-muted-foreground" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(analysis.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-sm mb-2">
                  <MapPin className="w-3 h-3 text-primary" />
                  <span className="truncate">{analysis.location || 'Unknown location'}</span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <Badge variant="secondary" className="gap-1">
                    <Package className="w-3 h-3" />
                    {analysis.summary.totalObjects} items
                  </Badge>
                  <Badge variant="secondary" className="gap-1">
                    <Scale className="w-3 h-3" />
                    {analysis.summary.totalWeight}g
                  </Badge>
                </div>
              </div>

              {/* Expand Icon */}
              {expandedId === analysis.id ? (
                <ChevronUp className="w-5 h-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              )}
            </button>

            {/* Expanded Details */}
            {expandedId === analysis.id && (
              <div className="border-t border-border/50 p-4 space-y-4">
                {/* Full Image */}
                {analysis.imageUrl && (
                  <div className="rounded-lg overflow-hidden">
                    <img 
                      src={analysis.imageUrl} 
                      alt="Analyzed waste" 
                      className="w-full h-48 object-cover"
                    />
                  </div>
                )}

                {/* Summary Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-accent/10 rounded-lg p-3 text-center">
                    <p className="text-xs text-accent font-medium">Recyclable</p>
                    <p className="text-lg font-bold text-accent">{analysis.summary.recyclableWeight}g</p>
                  </div>
                  <div className="bg-destructive/10 rounded-lg p-3 text-center">
                    <p className="text-xs text-destructive font-medium">Non-Recyclable</p>
                    <p className="text-lg font-bold text-destructive">{analysis.summary.nonRecyclableWeight}g</p>
                  </div>
                </div>

                {/* Objects List */}
                <div className="space-y-2">
                  <h5 className="text-sm font-medium text-muted-foreground">Detected Items</h5>
                  <div className="space-y-1">
                    {analysis.objects.slice(0, 3).map((obj) => (
                      <div key={obj.id} className="flex items-center justify-between text-sm bg-background rounded-lg px-3 py-2">
                        <span>{obj.name}</span>
                        <Badge variant="outline" className="text-xs">{obj.plasticType}</Badge>
                      </div>
                    ))}
                    {analysis.objects.length > 3 && (
                      <p className="text-xs text-muted-foreground text-center py-1">
                        +{analysis.objects.length - 3} more items
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
