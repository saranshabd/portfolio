import React from 'react'

import 'pages/styles.scss'

interface Props {
  Component: React.ComponentType
  pageProps: object
}

const App: React.FC<Props> = ({ Component, pageProps }: Props) => {
  return <Component {...pageProps} />
}

export default App
