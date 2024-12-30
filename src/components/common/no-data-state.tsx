import { Frown } from 'lucide-react'
import React from 'react'

const NoDataState = ({ message }: { message: string }) => (
   <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
      <Frown className="w-12 h-12 text-muted-foreground" />
      <p className="text-lg text-muted-foreground">{message}</p>
   </div>
)

export default NoDataState