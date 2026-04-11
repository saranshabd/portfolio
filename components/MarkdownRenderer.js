'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function MarkdownRenderer({ children }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        a: ({ href, children }) => {
          const isExternal = href?.startsWith('http')

          return (
            <a
              className="terminal-markdown__link"
              href={href}
              rel={isExternal ? 'noreferrer' : undefined}
              target={isExternal ? '_blank' : undefined}
            >
              {children}
            </a>
          )
        },
      }}
    >
      {children}
    </ReactMarkdown>
  )
}
