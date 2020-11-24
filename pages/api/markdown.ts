import fs from 'fs'
import { NextApiHandler, NextApiResponse } from 'next'

const getMarkdown: NextApiHandler = (req, res) => {
  if ('GET' !== req.method) {
    setResponse(res, 400, 'Only GET method is supported')
    return
  }
  const { id } = req.query
  if (!id) {
    setResponse(res, 400, 'Empty ID param passed')
    return
  }
  const fileName = `static/articles/${id}.md`
  if (!fs.existsSync(fileName)) {
    setResponse(res, 400, 'Invalid ID param passed')
    return
  }
  const markdown = fs.readFileSync(fileName, 'utf8')
  setResponse(res, 200, markdown)
}

const setResponse = (
  res: NextApiResponse,
  statusCode: number,
  message: string
) => {
  res.setHeader('Content-Type', 'application/json')
  res.statusCode = statusCode
  res.end(JSON.stringify({ error: message }))
}

export default getMarkdown
