import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          {/* <!-- The core Firebase JS SDK is always required and must be listed first --> */}
          <script src='https://www.gstatic.com/firebasejs/8.4.1/firebase-app.js' />

          {/* <!-- TODO: Add SDKs for Firebase products that you want to use
     https://firebase.google.com/docs/web/setup#available-libraries --> */}
          <script src='https://www.gstatic.com/firebasejs/8.4.1/firebase-analytics.js' />

          <script
            dangerouslySetInnerHTML={{
              __html: `
              // Your web app's Firebase configuration
              // For Firebase JS SDK v7.20.0 and later, measurementId is optional
              if ('production' === process.env.NODE_ENV) {
                var firebaseConfig = {
                  apiKey: 'AIzaSyBKm34oTmNw7BGSPznWaauYK1dAa_DrZZU',
                  authDomain: 'portfolio-website-246cb.firebaseapp.com',
                  projectId: 'portfolio-website-246cb',
                  storageBucket: 'portfolio-website-246cb.appspot.com',
                  messagingSenderId: '951014901759',
                  appId: '1:951014901759:web:a04473cdbb857732b0c9ca',
                  measurementId: 'G-V8JZXGKLDF',
                }
                // Initialize Firebase
                firebase.initializeApp(firebaseConfig)
                firebase.analytics()
              }
              `,
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
