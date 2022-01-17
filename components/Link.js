function Link({ href, children }) {
  return (
    <a href={href} target="blank">
      {children}
    </a>
  )
}

export default Link
