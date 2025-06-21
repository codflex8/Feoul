import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

interface CountsCardProps {
  icon: React.ElementType;
  label: string;
  value: number;
  color: string;
  background: string;
}

const CountsCard: React.FC<CountsCardProps> = ({ icon: Icon, label, value, color, background }) => {
 
  return (
    <Card className="bg-white p-4 shadow-md rounded-lg flex gap-1 flex-col items-center">
      <CardContent className='text-right flex flex-row items-center justify-between gap-8 w-full pb-1'>
        <div style={{backgroundColor: background}} className='w-12 h-12 rounded-xl flex items-center justify-center'>
          <Icon color={color} className="w-6 h-6" />
        </div>
        <p className="text-xl font-semibold">{value}</p>
      </CardContent>
      <CardHeader className="flex flex-row items-center gap-2 justify-between p-0">
        <CardTitle className='text-[#202224] text-lg font-semibold mt-2'>{label}</CardTitle>
      </CardHeader>
    </Card>
  )
}

export default CountsCard