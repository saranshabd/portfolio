import React from 'react'
import styles from './styles.module.scss'

/**
 * ===========================================================
 * Container
 * ===========================================================
 */
interface ContainerProps {
  children: React.ReactNode
}

export const Container: React.FC<ContainerProps> = ({ children }) => {
  return <div className={styles['card-container']}>{children}</div>
}

/**
 * ===========================================================
 * Item
 * ===========================================================
 */

interface ItemProps {
  children: React.ReactNode
}

export const Item: React.FC<ItemProps> = ({ children }) => {
  return <div className={styles['card-item']}>{children}</div>
}

/**
 * ===========================================================
 * Title
 * ===========================================================
 */

interface TitleProps {
  children: React.ReactText
}

export const Title: React.FC<TitleProps> = ({ children }) => {
  return (
    <div className={styles['card-title']}>
      <h2>{children}</h2>
    </div>
  )
}

/**
 * ===========================================================
 * Subtitle
 * ===========================================================
 */

interface SubtitlesProps {
  children: React.ReactNode
}

export const Subtitles: React.FC<SubtitlesProps> = ({ children }) => {
  return <div className={styles['card-subtitles']}>{children}</div>
}

/**
 * ===========================================================
 * Left Subtitle
 * ===========================================================
 */

interface LeftSubtitleProps {
  children: React.ReactText
}

export const LeftSubtitle: React.FC<LeftSubtitleProps> = ({ children }) => {
  return <div className={styles['card-left-subtitle']}>{children}</div>
}

/**
 * ===========================================================
 * Right Subtitle
 * ===========================================================
 */

interface RightSubtitleProps {
  children: React.ReactText
}

export const RightSubtitle: React.FC<RightSubtitleProps> = ({ children }) => {
  return <div className={styles['card-right-subtitle']}>{children}</div>
}

/**
 * ===========================================================
 * Content
 * ===========================================================
 */

interface ContentProps {
  children: React.ReactText
}

export const Content: React.FC<ContentProps> = ({ children }) => {
  return (
    <div className={styles['card-content']}>
      <p>{children}</p>
    </div>
  )
}

/**
 * ===========================================================
 * ActionContainer
 * ===========================================================
 */

interface ActionContainerProps {
  children: React.ReactNode
}

export const ActionContainer: React.FC<ActionContainerProps> = (props) => {
  return <div className={styles['card-action-container']}>{props.children}</div>
}

/**
 * ===========================================================
 * ActionButton
 * ===========================================================
 */

interface ActionButtonProps {
  href: string
  color: string
  children: React.ReactText
}

export const ActionButton: React.FC<ActionButtonProps> = (props) => {
  return (
    <a
      href={props.href}
      className={styles['card-action-btn']}
      style={{ backgroundColor: props.color }}
    >
      {props.children}
    </a>
  )
}

/**
 * ===========================================================
 * Icons
 * ===========================================================
 */

interface IconsProps {
  hrefs: string[]
}

export const Icons: React.FC<IconsProps> = ({ hrefs }) => {
  const renderImages = () => {
    return hrefs.map((href) => (
      <img src={href} alt='' className={styles['icon']} />
    ))
  }
  return <div className={styles['card-icons']}>{renderImages()}</div>
}
