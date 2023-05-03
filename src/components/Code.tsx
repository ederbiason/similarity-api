"use client"

import React, { FC, useEffect, useState } from 'react'
import { themes, type Language, Highlight } from 'prism-react-renderer'
import { useTheme } from 'next-themes'

interface CodeProps {
    code: string
    show: boolean
    language: Language
    animationDelay?: number
    animated?: boolean
}

const Code: FC<CodeProps> = ({code, show, language, animationDelay, animated}) => {
  const { theme: applicationTheme } = useTheme()
  const [text, setText] = useState(animated ? '' : code)

  useEffect(() => {
    if(show && animated) {
        let i = 0

        setTimeout(() => {
            const intervalId = setInterval(() => {
                setText(code.slice(0, i))
                i++

                if(i > code.length) {
                    clearInterval(intervalId)
                }
            }, 15)

            return () => clearInterval(intervalId)
        }, animationDelay || 150)
    }
  }, [animated, show, code, animationDelay])

  const numberOfLines = text.split(/\r\n|\r|\n/).length

  const darkTheme = themes.nightOwl
  const lightTheme = themes.nightOwlLight

  const theme = applicationTheme === 'light' ? lightTheme : darkTheme

  return (
    <Highlight code={text} language={language} theme={theme}>
        {({className, tokens, getLineProps, getTokenProps}) => (
            <pre 
                className={className + 'transition-all w-fit bg-transparent duration-100 py-0 no-scrollbar'}
                style={{
                    maxHeight: show ? numberOfLines * 24 : 0,
                    opacity: show ? 1 : 0
                }}
            >
                {tokens.map((line, i) => {
                    // eslint-disable-next-line no-unused-vars
                    const {key, ...rest} = getLineProps({line, key: i})

                    return (
                        <div 
                            key={`line-${i}`} 
                            style={{position: 'relative'}} 
                            {...rest}
                        >
                            {line.map((token, index) => {
                                // eslint-disable-next-line no-unused-vars
                                const {key, ...props} = getTokenProps({token, i})

                                return <span key={index} {...props}></span>
                            })}
                        </div>
                    )
                })}
            </pre>
        )}
    </Highlight>
  )
}

export default Code