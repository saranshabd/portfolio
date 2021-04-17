import React from 'react'
import Head from 'next/head'

interface Props {
  title: string
  description: string
  url: string
  icon: string
  creator: string
}

const Meta: React.FC<Props> = (props) => {
  return (
    <Head>
      <title>{props.title}</title>

      {/* General */}
      <link rel="icon" href={props.icon} />
      <meta name="description" content={props.description} />

      {/* OG */}
      <meta property="og:type" content="website" />
      <meta name="og:title" property="og:title" content={props.title} />
      <meta
        name="og:description"
        property="og:description"
        content={props.description}
      />
      <meta property="og:site_name" content={props.creator} />
      <meta property="og:url" content={props.url} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={props.title} />
      <meta name="twitter:description" content={props.description} />
      <meta name="twitter:site" content={props.url} />
      <meta name="twitter:creator" content={props.creator} />
      <meta name="twitter:image" content={props.icon} />
    </Head>
  )
}

export default Meta
