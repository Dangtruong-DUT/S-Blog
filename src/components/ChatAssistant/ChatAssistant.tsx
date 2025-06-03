import { useState, useRef, useEffect } from 'react'
import classNames from 'classnames/bind'
import styles from './ChatAssistant.module.scss'
import { HiSparkles, HiXMark, HiPaperAirplane, HiChatBubbleOvalLeft } from 'react-icons/hi2'
import { RiRobot2Fill } from 'react-icons/ri'
import { geminiService } from 'src/apis/gemini.api'
import MarkdownRenderer from '../MarkdownRenderer'

const cx = classNames.bind(styles)

interface ChatAssistantProps {
    currentTitle?: string
    currentDescription?: string
    currentContent?: string
    currentCategory?: string
}

interface Message {
    id: string
    text: string
    isUser: boolean
    timestamp: Date
}

const ChatAssistant = ({ currentTitle, currentDescription, currentContent, currentCategory }: ChatAssistantProps) => {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: '👋 Xin chào! Tôi là trợ lý AI cho việc viết blog. Tôi có thể giúp bạn:\n\n📝 **Cải thiện tiêu đề và mô tả**\n✍️ **Viết và phát triển nội dung**\n🔍 **Tối ưu SEO**\n💡 **Đưa ra ý tưởng mới**\n\nBạn có thể hỏi tôi bất cứ điều gì về bài viết đang viết!',
            isUser: false,
            timestamp: new Date()
        }
    ])
    const [inputValue, setInputValue] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    // Auto scroll to bottom when new message arrives
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    // Focus input when chat opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus()
        }
    }, [isOpen])

    const handleSendMessage = async () => {
        if (!inputValue.trim()) return

        const userMessage: Message = {
            id: Date.now().toString(),
            text: inputValue,
            isUser: true,
            timestamp: new Date()
        }

        setMessages((prev) => [...prev, userMessage])
        setInputValue('')
        setIsTyping(true)

        try {
            // Create context for AI
            const context = `
Bối cảnh bài viết hiện tại:
- Tiêu đề: ${currentTitle || 'Chưa có'}
- Mô tả: ${currentDescription || 'Chưa có'}
- Danh mục: ${currentCategory || 'Chưa chọn'}
- Nội dung: ${currentContent?.substring(0, 1000) || 'Chưa có nội dung'}

Câu hỏi/Yêu cầu: ${inputValue}

Hãy trả lời một cách hữu ích và cụ thể dựa trên bối cảnh bài viết.
            `

            const response = await geminiService.generateContent(context)

            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: response,
                isUser: false,
                timestamp: new Date()
            }

            setMessages((prev) => [...prev, aiMessage])
        } catch (error) {
            console.error('Error generating AI response:', error)
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: '😅 Xin lỗi, tôi gặp sự cố khi xử lý yêu cầu của bạn. Vui lòng thử lại sau.',
                isUser: false,
                timestamp: new Date()
            }
            setMessages((prev) => [...prev, errorMessage])
        } finally {
            setIsTyping(false)
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    // Quick suggestions for blog writing
    const quickSuggestions = [
        {
            text: 'Hãy tối ưu tiêu đề cho SEO',
            icon: '🔍'
        },
        {
            text: 'Gợi ý cải thiện mô tả',
            icon: '✨'
        },
        {
            text: 'Viết đoạn mở đầu hấp dẫn',
            icon: '📝'
        },
        {
            text: 'Tạo outline chi tiết',
            icon: '📋'
        }
    ]

    return (
        <div className={cx('chat-assistant', { open: isOpen })}>
            {/* Chat Toggle Button */}
            <button
                className={cx('toggle-button')}
                onClick={() => setIsOpen(!isOpen)}
                aria-label={isOpen ? 'Đóng chat' : 'Mở chat AI'}
            >
                {isOpen ? <HiXMark /> : <HiChatBubbleOvalLeft />}
                {!isOpen && <HiSparkles className={cx('sparkle-icon')} />}
            </button>

            {/* Chat Panel */}
            {isOpen && (
                <div className={cx('chat-panel')}>
                    {/* Header */}
                    <div className={cx('chat-header')}>
                        <div className={cx('header-info')}>
                            <RiRobot2Fill className={cx('bot-icon')} />
                            <div>
                                <h3 className={cx('title')}>AI Writing Assistant</h3>
                                <p className={cx('subtitle')}>Được hỗ trợ bởi Gemini AI</p>
                            </div>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className={cx('messages-container')}>
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={cx('message', {
                                    'user-message': message.isUser,
                                    'ai-message': !message.isUser
                                })}
                            >
                                {!message.isUser && (
                                    <div className={cx('message-avatar')}>
                                        <RiRobot2Fill />
                                    </div>
                                )}
                                <div className={cx('message-content')}>
                                    <div className={cx('message-text')}>
                                        {message.isUser ? message.text : <MarkdownRenderer content={message.text} />}
                                    </div>
                                    <div className={cx('message-time')}>
                                        {message.timestamp.toLocaleTimeString('vi-VN', {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Typing indicator */}
                        {isTyping && (
                            <div className={cx('message', 'ai-message')}>
                                <div className={cx('message-avatar')}>
                                    <RiRobot2Fill />
                                </div>
                                <div className={cx('message-content')}>
                                    <div className={cx('typing-indicator')}>
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Suggestions */}
                    {messages.length === 1 && (
                        <div className={cx('quick-suggestions')}>
                            <p className={cx('suggestions-title')}>Gợi ý nhanh:</p>
                            <div className={cx('suggestions-grid')}>
                                {quickSuggestions.map((suggestion, index) => (
                                    <button
                                        key={index}
                                        className={cx('suggestion-button')}
                                        onClick={() => setInputValue(suggestion.text)}
                                    >
                                        <span className={cx('suggestion-icon')}>{suggestion.icon}</span>
                                        <span className={cx('suggestion-text')}>{suggestion.text}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Input Area */}
                    <div className={cx('input-area')}>
                        <div className={cx('input-container')}>
                            <input
                                ref={inputRef}
                                type='text'
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder='Hỏi AI về bài viết của bạn...'
                                className={cx('chat-input')}
                                disabled={isTyping}
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={!inputValue.trim() || isTyping}
                                className={cx('send-button')}
                                aria-label='Gửi tin nhắn'
                            >
                                <HiPaperAirplane />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ChatAssistant
