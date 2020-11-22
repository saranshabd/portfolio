import React from 'react'
import marked from 'marked'
import sanitizeHtml from 'sanitize-html'
import { Container } from '@material-ui/core'

import { BackButton } from 'components/profile/BackButton'

import styles from './styles.module.scss'

const Article: React.FC = () => {
  const markdown = `Hello everyone, hope you're coding well.

  ## Prerequisites
  
  In the last article of this "DevOps with Docker" series, I explained how you can use Docker to make your life easy. I discussed how most of the developers are hesitant to try Docker and there are several reasons for that, so please check out that article if you've not read it already.
  
  In that article, I also mentioned a few use cases of Docker. Now, I'm going to write individual articles for each of the use cases I mentioned there, explaining in-depth and providing code snippets so that even amateurs can pick up and use Docker in their daily development life.
  
  ## Today's topic of discussion
  
  In this article, I am going to explain how one can use Docker as a package manager for their development machine. Most of the developers use \`brew\` and \`apt\` as their package managers in macOS and Ubuntu respectively. Although there's nothing wrong with both of them, there might be scenarios where these guys will fail you.
  
  # What's wrong with \`brew\` and \`apt\`?
  
  Imagine you're a freelancer who's using MongoDB v3.6 for personal projects. You just signed a new client and the client asks you to use the latest version of MongoDB, which is v4.4. Now, how are you going to manage two different and independent versions of MongoDB on your development machine? I'm not saying there's no way of doing this, I'm just saying that there's an easier way, which is to use Docker.
  
  ## Docker at your service!
  
  Docker is a container management service, and containers by definition provide an isolated environment to whatever is running inside. Isn't that exactly what we need? We need two MongoDB services to run independently, without affecting each other.
  
  You can simply create two Docker containers and run MongoDB v3.6 on one and MongoDB v4.4 on the other. Problem solved!
  
  # Solution Implementation
  
  Docker comes with an amazing CLI for developer's to take advantage of its services and features. Docker commands generally tends to be very long and scary, but if you understand the meaning of each and every command and sub-command then it becomes a piece of cake.
  
  Here's the command to run MongoDB v4.2.5 inside a Docker container:
  
  \`\`\`bash
  docker run --rm -d \

    -p 27017:27017 \
  
    --env MONGO_INITDB_DATABASE=test_api_v4 \
  
    -v $(pwd)/volumes/mongo-4.2.5:/data/db \
  
    --name test_mongodb \
  
    mongo:4.2.5
  \`\`\`
  
  Using this command, you can create a Docker container running MongoDB v4.2.5 on port 27017. So, you can run multiple such instances on your development machine, with each of them hosted on a separate port number.
  
  ## Command breakdown
  
  As I said, once you fully understand Docker commands, it will take no time for you to write one on your own (maybe for a different use case). I've broken down the above Docker command into meaningful chunks so that it will be easier for anyone to understand what is happening.
  
  ### Create a Docker container
  
  This part of the command is creating a new Docker container. The \`--rm\` flag tells Docker to delete the container once we stop it, and the \`-d\` flag tells Docker to run the container in detached mode (which means the container will not terminate once we close the terminal).
  
  \`\`\`bash
  docker run --rm -d
  \`\`\`
  
  ### Map port numbers
  
  This part of the command maps host port number with container port number. The mapping format is \`(host-port-number):(container-port-number)\`.
  
  \`\`\`bash
  -p 27017:27017
  \`\`\`
  
  ### Provide environment variables
  
  This part of the command provides any environment variables (if needed) to the container. This is an ideal use case if you want to create a container to run database inside it because you would want to set user credentials and other required database properties at the time of its creation. Here, we are setting the name of the database MongoDB creates by default.
  
  \`\`\`bash
  --env MONGO_INITDB_DATABASE=test_api_v4
  \`\`\`
  
  ### Create docker volume
  
  This part of the command creates Docker volume. Docker volume is nothing but a storage bridge between the host and the container. In this case, we would like to persist database files to our development machine (which is the host) so we create a Docker volume which maps our current directory to the directory in the container where MongoDB store its database files.
  
  \`\`\`bash
  -v $(pwd)/volumes/mongo-4.2.5:/data/db
  \`\`\`
  
  ### Name the container
  
  I think this is self-explanatory. By default, Docker assigns a random string to it, if you don't provide it explicitly.
  
  \`\`\`bash
  --name test_mongodb
  \`\`\`
  
  ### Define Docker image
  
  This part of the command defines what image do you want to run inside the container. The image name is of the format: \`(image-name):(image-version)\`. By default, if you don't provide a version then Docker assumes it to be \`latest\`.
  
  \`\`\`bash
  mongo:4.2.5
  \`\`\``

  console.log(sanitizeHtml(marked(markdown)))

  return (
    <div className={styles['outer-container']}>
      <Container className={styles['inner-container']}>
        <BackButton href='/experiences/articles' />
        <h1 className={styles['title']}>
          How Docker can help you sleep well at night?
        </h1>
        <div className={styles['metadata']}>
          <div className={styles['series']}>DevOps with Docker</div>
          <div className={styles['date']}>October 27, 2020</div>
        </div>
        <div
          className={styles['content']}
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(marked(markdown)) }}
        ></div>
      </Container>
      <style jsx global>
        {`
          body {
            background: #f1c40f;
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
