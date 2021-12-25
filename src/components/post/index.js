import React, { useEffect, useState } from 'react'
import { useRouteMatch } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import {  materialOceanic} from 'react-syntax-highlighter/dist/esm/styles/prism'
import remarkGfm from 'remark-gfm'
import remarkComments from 'remark-remove-comments'
import remarkBreaks from 'remark-breaks'
import { Paper } from '@material-ui/core'

// https://anobjectisa.com/?p=387

export default function Post() {
  
  const match = useRouteMatch('/posts/:post')
  let [ content, setContent] = useState({md: ""});

  useEffect(() => {
    let post = match.params.post
    console.log('getting post', post)
    import(`../../posts/${post}.md`)
      .then(res => {
        fetch(res.default)
          .then(res => res.text())
          .then(md => setContent({md}))
          .catch(err => console.log(err))
      }).catch(err => console.log(err))
  }, [match.params.post])

  return (
    <div>
      <Paper>
        <div style={{"padding": "1rem 3rem"}}>
      <ReactMarkdown
        children={content.md}
        remarkPlugins={[remarkGfm, remarkComments, remarkBreaks]}
        components={{
          code({node, inline, className, children, ...props}) {
            const match = /language-(\w+)/.exec(className || '')
            return !inline && match ? (
              <SyntaxHighlighter
                children={String(children).replace(/\n$/, '')}
                style={materialOceanic}
                language={match[1]}
                PreTag="div"
                {...props}
              />
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            )
          }
        }}
      />
      </div>
      </Paper>
    </div>
  )
}