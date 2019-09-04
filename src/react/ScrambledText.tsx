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
}: ScrambledTextProps) => {
  const { currentText } = useScrambledText({
    text,
    config,
    running,
    interval,
    duration,
  })

  const Tag = wrapper || 'span'
  return <Tag>{currentText}</Tag>
}
