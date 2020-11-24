# Introduction

Hello everyone, hope you're coding well.

I was very surprised to realize that a lot of junior developers, college students and freelancers were not using Docker and some of them were not even interested to learn it. Unbeknownst to them most of the senior developers, DevOps engineers, product managers and the whole software industry is functioning on this technology.

This article is dedicated to these people, to enlighten them a whole new world of containerization. In this article, we will only focus on Docker and how we can use it to increase our productivity and save our resources.

# Terminologies

Before we dig deep into the use cases of Docker, let me brief you on a few terminologies:

### Containerization

It is a concept of running software inside containers. The benefit you get by doing so is that all of your applications will run in isolation and if (for some reason) one of the applications crashes then all the other will still keep on running.

### Container

A container basically provides an isolated environment to whatever is running inside it. As the name suggests, you can put whatever you want inside a container without worrying about the outer world.

### Image

This is the piece of software (along with all of its configurations) which runs inside a container. An image interacts with the container, which in turn interacts with the outer world. This gives developers a benefit to not to worry about the environment in which their code might run. They only have to build the software and configure it to run inside a container.

### Docker

At last, our beloved software. This is a container management service, which takes care of all the containers and their interactions with the outer world. For us, it is a magic box which we don't have to worry about.

# What all can I do with Docker?

There are a lot of things one can use Docker for, and the best part is that developers can use their creativity along with Docker to increase their productivity. At the end, its just a container management service and it is up to you to use those containers for your own benefit.

People who are not familiar with Docker thinks that it has very specific use cases or that it's just too advanced for them to use. For them Docker is used to:

- Either, build software in an environment close to production
- Or, deploy code in an isolated environment using containers

Although both of these uses cases are valid, that is not what all Docker can do. Here are a few uses cases that I personally came across with and would like to share with all of you:

### Install and manage multiple versions of the same software

You can use Docker to install software on your development machine, rather than using `apt` or `brew`. The main benefit you get here by using Docker is that you can easily manage this software and its configurations. For example, if you're installing MongoDB using Docker than you can run multiple MongoDB containers (one for each of your project) and that too on different ports (just in case one of them is already in use). You can install multiple versions of PostgreSQL on your development machine without those containers affecting each other. How cool is that?

### Share development and staging infrastructure with the team

Share development infrastructure with your team easily using Docker Compose and GitHub. Imagine a new software developer joined your team, then you will have to share your development infrastructure (test database files, how to run your application on stage, etc). You can do all of that using Docker Compose and push all the files to GitHub, then this new developer will only have to clone this repository and read the [`README.md`](http://readme.md) file to understand everything. Some of the startups use services on AWS to do the same task, but here you won't have to spend a dime.

### Use Linux shell on Mac or Windows

Easily install and use Linux shell on your Mac or Windows machine. A lot of developers either dual boot their system or install some virtual machine software to use a Linux shell, whereas you can do the same thing using Docker as well. And since containers are lighter than virtual machines, you won't notice the difference between your system shell and the Linux shell running inside a container.

One disclaimer I would like to add here is that you will have to create appropriate Docker volumes so that you are saving the work on your computer.

### Deploy code to production with just a single command

Pushing your Docker images to a container registry can be really beneficial because you will not have to move your code manually to the production instance (assuming you're working on a small project). With just a simple Docker command you can build and push your code to a container registry (as a Docker image) and then either create a pipeline to automatically deploy the pushed code or SSH into the production instance and simply pull the latest Docker images from the container registry.

This is something which I think could be very useful to freelancers because I noticed that most of the time they're busy either completing the projects, finding new clients or attending meetings with their existing clients so they don't have a lot of time pushing code to production or solving minor production issues which could've easily been avoided using Docker.

# Conclusion

Notice that I've not mentioned what all features does Docker provide, instead, I've just mentioned some of the use cases where Docker has proven to be very effective. That is how I use Docker and your use cases might be different from mine, but the tool will remain the same.

# Support

Please do leave a comment if you feel something could've been improved here. I can only continue writing such articles if I get support from you guys. Share it with your friends or colleagues if you feel like this could really help them, and do let me know if you want me to write an article explaining a particular topic or use-case from this one.
