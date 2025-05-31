import { useState, useRef, useEffect, useCallback } from 'react'
import classNames from 'classnames/bind'
import styles from './VirtualAssistant.module.scss'
import { HiChatBubbleOvalLeft, HiXMark, HiPaperAirplane } from 'react-icons/hi2'
import { RiRobot2Fill } from 'react-icons/ri'
import { geminiService } from 'src/apis/gemini.api'
import useIsMobile from 'src/hooks/useIsMobile'
import { generateFallbackResponse } from 'src/utils/virtualAssistant.util'

const cx = classNames.bind(styles)

interface Message {
    id: string
    text: string
    isUser: boolean
    timestamp: Date
}

interface VirtualAssistantProps {
    className?: string
}

const VirtualAssistant = ({ className }: VirtualAssistantProps) => {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: '👋 Xin chào! Tôi là trợ lý ảo thông minh của blog. Tôi được hỗ trợ bởi Gemini AI và có thể giúp bạn:\n\n🔍 Tìm kiếm bài viết\n📖 Hướng dẫn sử dụng website\n💡 Trả lời câu hỏi kỹ thuật\n❓ Giải đáp mọi thắc mắc\n\nBạn cần tôi hỗ trợ gì hôm nay?',
            isUser: false,
            timestamp: new Date()
        }
    ])
    const [inputValue, setInputValue] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const [position, setPosition] = useState({ x: 20, y: 20 })
    const [isDragging, setIsDragging] = useState(false)
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
    const [isConnected, setIsConnected] = useState(true)
    const [hasNewMessage, setHasNewMessage] = useState(false)

    // Use mobile hook
    const isMobile = useIsMobile(768)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const assistantRef = useRef<HTMLDivElement>(null)
    const chatRef = useRef<HTMLDivElement>(null)

    // Handle virtual keyboard on mobile
    useEffect(() => {
        if (!isMobile) return

        const handleResize = () => {
            const viewportHeight = window.visualViewport?.height || window.innerHeight
            const windowHeight = window.innerHeight
            // Keyboard detection logic - can be extended if needed
            if (viewportHeight < windowHeight * 0.75) {
                // Handle keyboard open state
            }
        }

        window.visualViewport?.addEventListener('resize', handleResize)
        window.addEventListener('resize', handleResize)

        return () => {
            window.visualViewport?.removeEventListener('resize', handleResize)
            window.removeEventListener('resize', handleResize)
        }
    }, [isMobile])

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSendMessage = async () => {
        if (!inputValue.trim()) return

        const userMessage: Message = {
            id: Date.now().toString(),
            text: inputValue.trim(),
            isUser: true,
            timestamp: new Date()
        }

        setMessages((prev) => [...prev, userMessage])
        setInputValue('')
        setIsTyping(true)
        setIsConnected(true)

        try {
            // Call Gemini API
            const botResponse = await geminiService.generateContent(userMessage.text)
            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: botResponse,
                isUser: false,
                timestamp: new Date()
            }
            setMessages((prev) => [...prev, botMessage])

            // Show notification if chat is closed
            if (!isOpen) {
                setHasNewMessage(true)
                setTimeout(() => setHasNewMessage(false), 5000)
            }
        } catch (error) {
            console.error('Error getting AI response:', error)
            setIsConnected(false)

            // Fallback to predefined responses
            const fallbackResponse = generateFallbackResponse(userMessage.text)
            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: fallbackResponse,
                isUser: false,
                timestamp: new Date()
            }
            setMessages((prev) => [...prev, botMessage])
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

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!isOpen) {
            setIsDragging(true)
            const rect = assistantRef.current?.getBoundingClientRect()
            if (rect) {
                setDragOffset({
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top
                })
            }
        }
    }

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (isDragging && !isOpen) {
            const newX = e.clientX - dragOffset.x
            const newY = e.clientY - dragOffset.y

            // Keep within viewport bounds
            const maxX = window.innerWidth - 60
            const maxY = window.innerHeight - 60

            setPosition({
                x: Math.max(0, Math.min(newX, maxX)),
                y: Math.max(0, Math.min(newY, maxY))
            })
        }
    }, [isDragging, isOpen, dragOffset])

    const handleMouseUp = () => {
        setIsDragging(false)
    }

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove)
            document.addEventListener('mouseup', handleMouseUp)
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseup', handleMouseUp)
        }
    }, [isDragging, handleMouseMove])

    // Set initial position to bottom right
    useEffect(() => {
        setPosition({
            x: window.innerWidth - 80,
            y: window.innerHeight - 100
        })
    }, [])

    return (
        <div
            ref={assistantRef}
            className={cx('virtual-assistant', className)}
            style={{
                position: 'fixed',
                right: isOpen ? '20px' : `${window.innerWidth - position.x - 60}px`,
                bottom: isOpen ? '20px' : `${window.innerHeight - position.y - 60}px`,
                zIndex: 9999
            }}
        >
            {/* Chat Window */}
            {isOpen && (
                <div ref={chatRef} className={cx('chat-window')}>
                    <div className={cx('chat-header')}>
                        <div className={cx('header-info')}>
                            <RiRobot2Fill className={cx('bot-icon')} />
                            <div>
                                <h3 className={cx('header-title')}>Trợ lý ảo AI</h3>
                                <p className={cx('header-subtitle')}>Được hỗ trợ bởi Gemini</p>
                                <div className={cx('status-indicator', { offline: !isConnected })}>
                                    <div className={cx('status-dot')} />
                                    <span className={cx('status-text')}>
                                        {isConnected ? 'Đang hoạt động' : 'Chế độ offline'}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <button className={cx('close-btn')} onClick={() => setIsOpen(false)} aria-label='Đóng chat'>
                            <HiXMark />
                        </button>
                    </div>
                    <div className={cx('chat-messages')}>
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={cx('message', {
                                    'user-message': message.isUser,
                                    'bot-message': !message.isUser
                                })}
                            >
                                <div className={cx('message-content')}>
                                    {message.text.split('\n').map((line, index) => (
                                        <span key={index}>
                                            {line}
                                            {index < message.text.split('\\n').length - 1 && <br />}
                                        </span>
                                    ))}
                                </div>
                                <div className={cx('message-time')}>
                                    {message.timestamp.toLocaleTimeString('vi-VN', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className={cx('message', 'bot-message', 'typing')}>
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
                    <div className={cx('chat-input')}>
                        <textarea
                            value={inputValue}
                            onChange={(e) => {
                                setInputValue(e.target.value)
                                // Auto resize
                                e.target.style.height = 'auto'
                                e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`
                            }}
                            onKeyPress={handleKeyPress}
                            placeholder='💬 Hỏi tôi bất cứ điều gì...'
                            className={cx('input-field')}
                            rows={1}
                            disabled={isTyping}
                        />
                        <button
                            onClick={handleSendMessage}
                            className={cx('send-btn', {
                                disabled: !inputValue.trim() || isTyping
                            })}
                            disabled={!inputValue.trim() || isTyping}
                            aria-label='Gửi tin nhắn'
                            title={isTyping ? 'Đang xử lý...' : 'Gửi tin nhắn'}
                        >
                            <HiPaperAirplane />
                        </button>
                    </div>
                </div>
            )}
            {/* Chat Toggle Button */}
            <button
                className={cx('chat-toggle', {
                    'chat-open': isOpen,
                    dragging: isDragging,
                    minimized: !isOpen
                })}
                onClick={() => {
                    if (!isDragging) {
                        setIsOpen(!isOpen)
                        if (!isOpen) {
                            setHasNewMessage(false)
                        }
                    }
                }}
                onMouseDown={handleMouseDown}
                aria-label={isOpen ? 'Đóng chat' : 'Mở chat'}
            >
                {isOpen ? <HiXMark /> : <HiChatBubbleOvalLeft />}
                {!isOpen && <div className={cx('notification-dot', { 'has-message': hasNewMessage })} />}
            </button>
        </div>
    )
}

export default VirtualAssistant
