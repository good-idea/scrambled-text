import * as React from 'react'
import { useScrambledText, UseScrambledTextConfig } from './useScrambledText'

interface ScrambledTextProps extends UseScrambledTextConfig {
  text: string
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
  const { currentText } = useScrambledText(text, {
    config,
    running,
    interval,
    duration,
  })

  const Tag = wrapper || 'span'
  return <Tag>{currentText}</Tag>
}
