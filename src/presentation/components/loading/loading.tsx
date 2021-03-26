import React from 'react'
import { Spinner } from '..'

type Props = {
  className?: string
}

const Loading: React.FC<Props> = ({ className }: Props) => {
  return (
    <div className={className} data-testid="loading">
      <Spinner />
    </div>
  )
}

export default Loading
