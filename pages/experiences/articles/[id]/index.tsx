import axios from 'axios'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

import marked from 'marked'
import sanitizeHtml from 'sanitize-html'
import { Container } from '@material-ui/core'

import { BackButton } from 'components/profile/BackButton'

import _data from 'static/articles/index.json'
import { ArticleDataType } from 'utils/interfaces'

const data = _data as ArticleDataType[]

import styles from './styles.module.scss'

const Article: React.FC = () => {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [series, setSeries] = useState('')
  const [date, setDate] = useState('')
  const [markdown, setMarkdown] = useState('')

  useEffect(() => {
    const { id } = router.query
    if (!id) return
    ;(async function () {
      const res = await axios.get(`/${id}.md`)
      setMarkdown(res.data)
      setTitle(data.find((item) => item.code === id)?.title || '')
      setSeries(data.find((item) => item.code === id)?.series || '')
      setDate(data.find((item) => item.code === id)?.date || '')
    })()
  }, [router.query])

  return (
    <div className={styles['outer-container']}>
      <Container className={styles['inner-container']}>
        <BackButton href='/experiences/articles' />
        <h1 className={styles['title']}>{title}</h1>
        <div className={styles['metadata']}>
          <div className={styles['series']}>{series}</div>
          <div className={styles['date']}>{date}</div>
        </div>
        <div
          className={styles['content']}
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(marked(markdown)) }}
        ></div>
      </Container>
      <style jsx global>
        {`
          body {
            background: #76448a;
            margin: 0;
            padding: 0;
            height: 100%;
          }
        `}
      </style>
    </div>
  )
}

export default Article
