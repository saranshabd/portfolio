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

interface SubtitleProps {
  children: React.ReactText
}

export const Subtitle: React.FC<SubtitleProps> = ({ children }) => {
  return <div className={styles['card-subtitle']}>{children}</div>
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
