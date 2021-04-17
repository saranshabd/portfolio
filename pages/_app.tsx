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
        
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&display=swap" rel="stylesheet"></link>

      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default App
