import React from 'react'
import Head from 'next/head'

import 'pages/styles.scss'

interface Props {
  Component: React.ComponentType
  pageProps: object
}

const App: React.FC<Props> = ({ Component, pageProps }: Props) => {
  return (
    <>
      <Head>
        <title>Shabd Saran</title>
        <link
          rel='shortcut icon'
          href='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>✌🏻</text></svg>'
        />
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default App
