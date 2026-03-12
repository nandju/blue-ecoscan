'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3 } from 'lucide-react'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import type { DetectedObject } from '@/lib/types'
import { PLASTIC_TYPES, CONDITIONS, OBJECT_TYPES } from '@/lib/types'

interface StatisticsProps {
  objects: DetectedObject[]
}

const CHART_COLORS = {
  primary: 'hsl(220, 70%, 50%)',
  accent: 'hsl(155, 60%, 45%)',
  chart3: 'hsl(200, 50%, 50%)',
  chart4: 'hsl(180, 45%, 55%)',
  chart5: 'hsl(240, 55%, 50%)',
  warning: 'hsl(45, 90%, 55%)',
  destructive: 'hsl(0, 70%, 55%)',
  muted: 'hsl(220, 10%, 70%)',
}

export function Statistics({ objects }: StatisticsProps) {
  if (objects.length === 0) {
    return (
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Statistics
          </CardTitle>
          <CardDescription>
            Charts will appear after analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No data to display</p>
            <p className="text-sm">Analyze waste to see statistics</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Object Types Distribution
  const objectTypesData = OBJECT_TYPES.map(type => ({
    name: type,
    value: objects.filter(obj => obj.shape === type).length,
  })).filter(d => d.value > 0)

  // Recyclability Distribution
  const recyclableCount = objects.filter(obj => obj.recyclable).length
  const recyclabilityData = [
    { name: 'Recyclable', value: recyclableCount },
    { name: 'Non-Recyclable', value: objects.length - recyclableCount },
  ]

  // Brands Distribution
  const brandsMap = new Map<string, number>()
  objects.forEach(obj => {
    const brand = obj.brand || 'Unknown'
    brandsMap.set(brand, (brandsMap.get(brand) || 0) + 1)
  })
  const brandsData = Array.from(brandsMap.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5)

  // Condition Distribution
  const conditionData = CONDITIONS.map(condition => ({
    name: condition,
    value: objects.filter(obj => obj.condition === condition).length,
  })).filter(d => d.value > 0)

  // Plastic Types Distribution
  const plasticTypesData = PLASTIC_TYPES.map(type => ({
    name: type,
    value: objects.filter(obj => obj.plasticType === type).length,
  })).filter(d => d.value > 0)

  const pieColors = [CHART_COLORS.primary, CHART_COLORS.accent, CHART_COLORS.chart3, CHART_COLORS.chart4, CHART_COLORS.chart5, CHART_COLORS.warning]
  const recyclableColors = [CHART_COLORS.accent, CHART_COLORS.destructive]
  const conditionColors = [CHART_COLORS.accent, CHART_COLORS.chart4, CHART_COLORS.warning, CHART_COLORS.destructive]

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          Statistics
        </CardTitle>
        <CardDescription>
          Visual breakdown of analyzed waste data
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Object Types */}
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">Object Types</h4>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={objectTypesData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {objectTypesData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recyclability */}
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">Recyclability</h4>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={recyclabilityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {recyclabilityData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={recyclableColors[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Most Polluting Brands */}
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">Top Brands</h4>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={brandsData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} width={80} />
                  <Tooltip />
                  <Bar dataKey="value" fill={CHART_COLORS.primary} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Condition Distribution */}
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">Waste Condition</h4>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={conditionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {conditionData.map((entry, index) => {
                      const colorIndex = CONDITIONS.indexOf(entry.name as typeof CONDITIONS[number])
                      return <Cell key={`cell-${index}`} fill={conditionColors[colorIndex]} />
                    })}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Plastic Types */}
          <div className="space-y-2 md:col-span-2">
            <h4 className="font-semibold text-sm">Plastic Types Distribution</h4>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={plasticTypesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {plasticTypesData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
