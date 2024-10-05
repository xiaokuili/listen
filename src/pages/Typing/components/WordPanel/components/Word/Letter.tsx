import { EXPLICIT_SPACE } from '@/constants'
import { fontSizeConfigAtom } from '@/store'
import { useAtomValue } from 'jotai'
import React from 'react'
import { useMemo } from 'react'

export type LetterState = 'normal' | 'correct' | 'wrong'

const stateClassNameMap: Record<string, Record<LetterState, string>> = {
  true: {
    normal: 'text-gray-400',
    correct: 'text-green-400 dark:text-green-700',
    wrong: 'text-red-400 dark:text-red-600',
  },
  false: {
    normal: 'text-gray-600 dark:text-gray-50',
    correct: 'text-green-600 dark:text-green-400',
    wrong: 'text-red-600 dark:text-red-400',
  },
}

export type LetterProps = {
  letter: string
  state?: LetterState
  visible?: boolean
  totalLetterCount: number // 新增：整个单词的字母总数
}

const Letter: React.FC<LetterProps> = ({ letter, state = 'normal', visible = true, totalLetterCount }) => {
  const fontSizeConfig = useAtomValue(fontSizeConfigAtom)
  const fontSize = useMemo(() => {
    const baseSize = fontSizeConfig.foreignFont
    const minSize = baseSize * 0.1 // 设置最小字体大小
    const maxSize = baseSize // 最大字体大小就是基础大小

    // 根据字符长度调整大小
    if (totalLetterCount === 1) {
      return baseSize
    } else if (totalLetterCount === 10) {
      return baseSize * 0.5
    } else {
      return baseSize * 0.5
    }
  }, [letter, fontSizeConfig.foreignFont, totalLetterCount])

  return (
    <span
      className={`m-0 p-0 font-mono font-normal ${
        stateClassNameMap[(letter === EXPLICIT_SPACE) as unknown as string][state]
      } pr-0.8 duration-0 dark:text-opacity-80`}
      style={{
        fontSize: `${fontSize}px`,
        display: 'inline-block',
        width: `${fontSize}px`,
        textAlign: 'center' as const,
      }}
    >
      {visible ? letter : '_'}
    </span>
  )
}

export default React.memo(Letter)
