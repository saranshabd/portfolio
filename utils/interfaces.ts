export interface IntroDataType {
  name: string
  message: string
}

export interface TechStackDataType {
  programmingLanguages: string[]
  frameworks: string[]
  technologies: string[]
}

export interface ProjectDataType {
  title: string
  description: string
  techStackIconUrls: [string]
  sourceCodeUrl?: string
}

export interface ExperienceDataType {
  title: string
  description: string
  date: string
  position?: string
}

export interface ArticleDataType {
  title: string
  series: string
  date: string
  description: string
  code: string
}
