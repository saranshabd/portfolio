import BaseLayout from '../../components/BaseLayout'

function Birthday() {
  return (
    <BaseLayout header={false} footer={false}>
      <p>On the occasion of my 23rd birthday</p>
      <h3>Go fuck yourself! 🎉</h3>
      <img
        // src="https://media.tenor.com/bxp_GSuKsmsAAAAd/fuck-yeah-fu.gif"
        src="/fuck-you.gif"
        width="100%"
      />
      <br />
      <br />
      <h4>Regards, Shabd :)</h4>
    </BaseLayout>
  )
}

export default Birthday
