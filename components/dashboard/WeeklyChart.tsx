"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { day: "Sat", visitor: 186,},
  { day: "Sun", visitor: 305, },
  { day: "Mon", visitor: 237, },
  { day: "Tus", visitor: 73, },
  { day: "Wed", visitor: 209, },
  { day: "Thur", visitor: 214, },
  { day: "Fri", visitor: 214, },
]

const chartConfig = {
  visitor: {
    label: "زائر",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export default function WeeklyChart() {
  return (
    <Card className="bg-white shadow-md rounded-lg">
      <CardHeader>
        <CardTitle className="text-xl">النشاط الأسبوعي</CardTitle>
        <CardDescription>January 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="visitor" fill="var(--color-visitor)" radius={8}>
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
         زيادة بنسبة 5% هذا الأسبوع <TrendingUp className="h-4 w-4" />
        </div>
      </CardFooter>
    </Card>
  )
}
