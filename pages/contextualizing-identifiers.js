import BaseLayout from '../components/BaseLayout'

import styles from '../styles/Home.module.css'

function Blog() {
  return (
    <BaseLayout>
      <h2>Contextualizing Identifiers</h2>
      <p>12th June 2023</p>
      <br />
      <h3 className={styles.pageSubTitleHeader}>Introduction</h3>
      <p>
        It’s hard to keep track of all the identifiers in a system. You can find
        at least 2 different identifiers in a simple authentication system: user
        ID and session ID. These identifiers are logged to files, reported on
        Sentry, sent to the frontend, passed around to other developers in Slack
        in bug reports, and most importantly, shared with the non-technical
        folks directly or indirectly.
      </p>
      <img src="/id-travel-chart.png" width="100%" />
      <p>
        The user.Id quickly gets translated to "507f1f77bcf86cd799439011” that
        is shared on Slack by the sales rep to report a bug. The developers then
        have to make sense out of this random ID and try to map it to an actual
        database record. It becomes a nuisance when the context of the ID is not
        shared and/or the reporting source does not paint a clear picture.
      </p>
      <h3 className={styles.pageSubTitleHeader}>Root cause</h3>
      <p>
        The root cause is the loss of context from the identifier. The source of
        the identifier can be a log file, Slack message, Sentry report, CMS
        dashboard or Google Analytics. You cannot control where the identifier
        might travel but it will only loose more context as it moves further
        away from the system.
      </p>
      <p>
        This might sound trivial if you haven’t worked on medium/large scale
        projects or haven’t dealt with enough non-technical folks to understand
        the depth of the problem. This post is not for you, if that is the case.
      </p>
      <p>
        The issue is that we loose context of an identifier as it travels away
        from the system. But, what if the context is attached to the identifier
        itself? Wouldn’t that solve the problem? The identifier can be allowed
        travel as far as the light goes without loosing the context.
      </p>
      <p>This is where identifier prefixing comes in.</p>
      <h3 className={styles.pageSubTitleHeader}>Reasoning</h3>
      <p>
        You must have seen identifiers like “TXN_507f1f77bcf86cd799439011”. The
        prefix “TX_” is used to contextualise the identifier. For example,
        without giving any information about the ID you can guess that it is a
        transaction ID. The exact nature of the transaction can be extracted
        from the database or the codebase.
      </p>
      <p>
        The idea is to attach a meaningful prefix to important identifiers in
        the system. It will ensure that these identifiers are quickly recognised
        outside the system even with minimal context. If a sales rep is sharing
        “TXN_507f1f77bcf86cd799439011” then you already know where to look i.e.
        the transaction records.
      </p>
      <p>
        The implementation is simpler than the theoretical reasoning itself. You
        just have to write conversion methods to convert your system ID to
        prefixed ID, and vice-versa.
      </p>
      <h3 className={styles.pageSubTitleHeader}>Implementation</h3>
      <p>
        Let’s assume that your system IDs are UUID v5 formatted. You will,
        ideally, only care about the UUID formatting when reading from or
        writing to the database. You are free to ignore the string formatting in
        all the other parts of your system.
      </p>
      <img src="/implementation-visualization.png" width="100%" />
      <p>
        The conversion of UUID to (prefix)_UUID and vice-versa should only
        happen at the database layer. The rest of your codebase should not care
        if the identifier is a valid UUID string. The type validation, in the
        rest of the codebase, should only be on string.
      </p>
      <p>
        If all the conversions are written in the database layer then the
        database validations will not break and the context will be immediately
        attached to the identifier as well. Win-win!
      </p>
      <h3 className={styles.pageSubTitleHeader}>Centralised Prefixing</h3>
      <p>
        All the prefixes in the system must be centrally stored either in a
        config file or as enums. This will ensure that no two identifiers share
        the same prefix. It will also help you visualise all the important
        identifiers in your system in one glance.
      </p>
      <p>
        Also, note that you are not supposed to contextualise all the identifies
        that you have. It will only create chaos without adding much value. The
        idea is to contextualise only the most important identifies.
      </p>
      <p>
        As a heuristic, contextualise only those identifiers that are used to
        uniquely identify important entities in your system. For example: users,
        transactions, orders.
      </p>
      <h3 className={styles.pageSubTitleHeader}>Conclusion</h3>
      <p>
        Identifier contextualising is not a new concept. People have been doing
        it for years now.
      </p>
      <p>
        The idea is simple enough to explain without code. It just needs two
        methods to convert the system ID to prefixed ID and vice-versa, but it
        adds a lot of value and make things easier.
      </p>
    </BaseLayout>
  )
}

export default Blog
