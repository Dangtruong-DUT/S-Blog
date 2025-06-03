import React from 'react'
import classNames from 'classnames/bind'
import styles from './MarkdownRenderer.module.scss'

const cx = classNames.bind(styles)

interface MarkdownRendererProps {
    content: string
    className?: string
}

interface ParsedElement {
    type: 'text' | 'bold' | 'link' | 'break' | 'heading'
    content: string
    href?: string
    level?: number // for headings (1, 2, 3, etc.)
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className }) => {
    const parseMarkdown = (text: string): ParsedElement[] => {
        const elements: ParsedElement[] = []
        let remainingText = text

        while (remainingText.length > 0) {
            // Check for headings at start of line or after line break
            const headingMatch = remainingText.match(/^(#{1,6})\s+(.+)(?:\n|$)/)
            if (headingMatch) {
                const level = headingMatch[1].length
                const headingContent = headingMatch[2].trim()
                elements.push({
                    type: 'heading',
                    content: headingContent,
                    level
                })
                remainingText = remainingText.slice(headingMatch[0].length)
                continue
            }

            // Check for line breaks
            const lineBreakMatch = remainingText.match(/^\n/)
            if (lineBreakMatch) {
                elements.push({ type: 'break', content: '' })
                remainingText = remainingText.slice(1)
                continue
            }

            // Check for bold text **bold**
            const boldMatch = remainingText.match(/^\*\*(.*?)\*\*/)
            if (boldMatch) {
                elements.push({ type: 'bold', content: boldMatch[1] })
                remainingText = remainingText.slice(boldMatch[0].length)
                continue
            }

            // Check for links [text](url) or direct URLs
            const linkMatch = remainingText.match(/^\[([^\]]+)\]\(([^)]+)\)/)
            if (linkMatch) {
                elements.push({
                    type: 'link',
                    content: linkMatch[1],
                    href: linkMatch[2]
                })
                remainingText = remainingText.slice(linkMatch[0].length)
                continue
            }

            // Check for direct URLs (http/https)
            const urlMatch = remainingText.match(/^(https?:\/\/[^\s]+)/)
            if (urlMatch) {
                elements.push({
                    type: 'link',
                    content: urlMatch[1],
                    href: urlMatch[1]
                })
                remainingText = remainingText.slice(urlMatch[0].length)
                continue
            }

            // Take the next character as regular text
            const nextChar = remainingText[0]
            const lastElement = elements[elements.length - 1]

            if (lastElement && lastElement.type === 'text') {
                lastElement.content += nextChar
            } else {
                elements.push({ type: 'text', content: nextChar })
            }

            remainingText = remainingText.slice(1)
        }

        return elements
    }

    const renderElements = (elements: ParsedElement[]) => {
        return elements.map((element, index) => {
            switch (element.type) {
                case 'heading': {
                    const HeadingTag = `h${element.level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
                    return React.createElement(
                        HeadingTag,
                        {
                            key: index,
                            className: cx('markdown-heading', `heading-${element.level}`)
                        },
                        element.content
                    )
                }
                case 'bold':
                    return (
                        <strong key={index} className={cx('markdown-bold')}>
                            {element.content}
                        </strong>
                    )
                case 'link': {
                    const isInternal =
                        element.href?.startsWith('/') ||
                        element.href?.includes('sblog.tech') ||
                        element.href?.includes(window.location.hostname)

                    return (
                        <a
                            key={index}
                            href={element.href}
                            className={cx('markdown-link', { 'internal-link': isInternal })}
                            target={isInternal ? '_self' : '_blank'}
                            rel={isInternal ? undefined : 'noopener noreferrer'}
                            onClick={(e) => {
                                // Handle internal navigation for SPA
                                if (isInternal && element.href?.startsWith('/')) {
                                    e.preventDefault()
                                    window.location.href = element.href
                                }
                            }}
                        >
                            {element.content}
                        </a>
                    )
                }
                case 'break':
                    return <br key={index} />
                case 'text':
                default:
                    return <span key={index}>{element.content}</span>
            }
        })
    }

    const parsedElements = parseMarkdown(content)

    return <div className={cx('markdown-content', className)}>{renderElements(parsedElements)}</div>
}

export default MarkdownRenderer
