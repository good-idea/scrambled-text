import * as React from 'react'
import { useScrambledText, ScrambledTextParams } from './useScrambledText'

interface ScrambledTextProps extends ScrambledTextParams {
  wrapper?: string | React.ComponentType
}

export const ScrambledText = ({
  text,
  config,
  running,
  interval,
  duration,
  wrapper,
  debug,
}: ScrambledTextProps) => {
  const { elapsed, currentText } = useScrambledText({
    text,
    config,
    running,
    interval,
    duration,
    debug,
  })

  const Tag = wrapper || 'span'
  return (
    <Tag>
      {elapsed} - {currentText}
    </Tag>
  )
}
