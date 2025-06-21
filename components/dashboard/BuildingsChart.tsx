"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

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
  {
    day: "Sat",
    booked: 186, sold: 80
  },
  {
    day: "Sun",
    booked: 305, sold: 200
  },
  {
    day: "Mon",
    booked: 237, sold: 120
  },
  {
    day: "Tus",
    booked: 73, sold: 190
  },
  {
    day: "Wed",
    booked: 209, sold: 130
  },
  {
    day: "Thur",
    booked: 214, sold: 140
  },
  {
    day: "Fri",
    booked: 214, sold: 140
  },
]

const chartConfig = {
  booked: {
    label: "محجوزة",
    color: "hsl(var(--chart-2))",
  },
  sold: {
    label: "مباعة",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig

export default function BuildingsChart() {
  return (
    <Card className="bg-white shadow-md rounded-lg">
      <CardHeader>
        <CardTitle className="text-xl">حالة الوحدات السكنية</CardTitle>
        <CardDescription>January 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
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
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="booked" fill="var(--color-booked)" radius={4} />
            <Bar dataKey="sold" fill="var(--color-sold)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
