import { useState, useRef, useEffect } from 'react'
import { HiSparkles, HiXMark, HiCheck, HiArrowPath, HiPaperAirplane } from 'react-icons/hi2'
import classNames from 'classnames/bind'
import styles from './ChatAIAssistant.module.scss'
import { ContentField, AIAssistantProps, ChatMessage } from '@/types/ai.types'
import QuickAction from '../QuickAction/QuickAction'
import ContentFieldSelector from './ContentFieldSelector'
import MarkdownRenderer from '../MarkdownRenderer'
import { useAIAssistant } from 'src/hooks/useAIAssistant'

const cx = classNames.bind(styles)

const ChatAIAssistant = ({ isOpen, onToggle, formData, onApplyToField }: AIAssistantProps) => {
    const [selectedField, setSelectedField] = useState<ContentField>('title')
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    const {
        messages,
        inputValue,
        isLoading,
        setInputValue,
        handleSendMessage,
        handleApplySuggestion,
        handleQuickAction,
        getInputPlaceholder,
        getQuickActionForField
    } = useAIAssistant(formData, selectedField, onApplyToField)

    // Auto scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    // Focus input when chat opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus()
        }
    }, [isOpen])

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    const renderMessage = (message: ChatMessage) => (
        <div key={message.id} className={cx('message', message.type)}>
            <div className={cx('message-content')}>
                {message.type === 'ai' ? (
                    <>
                        <MarkdownRenderer content={message.content} />
                        {message.suggestions && message.suggestions.length > 0 && (
                            <div className={cx('suggestions')}>
                                {message.suggestions.map((suggestion) => (
                                    <div key={suggestion.field + suggestion.action} className={cx('suggestion')}>
                                        <div className={cx('suggestion-content')}>
                                            <MarkdownRenderer content={suggestion.content} />
                                        </div>
                                        <div className={cx('suggestion-actions')}>
                                            <button
                                                onClick={() => handleApplySuggestion(suggestion, 'replace')}
                                                className={cx('apply-btn')}
                                            >
                                                <HiCheck /> Áp dụng
                                            </button>
                                            <button
                                                onClick={() => handleApplySuggestion(suggestion, 'append')}
                                                className={cx('append-btn')}
                                            >
                                                <HiArrowPath /> Thêm vào
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <p>{message.content}</p>
                )}
            </div>
        </div>
    )

    const quickAction = getQuickActionForField()

    return (
        <div className={cx('container', { open: isOpen })}>
            <div className={cx('header')}>
                <div className={cx('header-content')}>
                    <div className={cx('header-title')}>
                        <HiSparkles className={cx('header-icon')} />
                        <span>AI Assistant</span>
                    </div>
                    <button onClick={onToggle} className={cx('close-btn')} aria-label='Close'>
                        <HiXMark />
                    </button>
                </div>
                <ContentFieldSelector
                    selectedField={selectedField}
                    onFieldChange={setSelectedField}
                    className={cx('field-selector')}
                />
            </div>

            <div className={cx('chat-body')}>
                <div className={cx('messages')}>
                    {messages.length === 0 ? (
                        <div className={cx('welcome-message')}>
                            <HiSparkles className={cx('welcome-icon')} />
                            <h4>Xin chào! Tôi có thể giúp gì cho bạn?</h4>
                            <p>Tôi có thể giúp bạn:</p>
                            <ul>
                                <li>Đề xuất tiêu đề hấp dẫn</li>
                                <li>Cải thiện phần mô tả</li>
                                <li>Chỉnh sửa và tối ưu nội dung</li>
                            </ul>
                        </div>
                    ) : (
                        messages.map(renderMessage)
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {quickAction && quickAction.field && (
                    <div className={cx('quick-actions')}>
                        <h5>Hành động nhanh</h5>
                        <div className={cx('action-buttons')}>
                            <QuickAction
                                field={quickAction.field}
                                label={quickAction.label}
                                prompt={quickAction.prompt}
                                onClick={() => handleQuickAction(quickAction.prompt)}
                            />
                        </div>
                    </div>
                )}
            </div>

            <div className={cx('footer')}>
                <div className={cx('input-container')}>
                    <input
                        ref={inputRef}
                        type='text'
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder={getInputPlaceholder()}
                        className={cx('input')}
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={!inputValue.trim() || isLoading}
                        className={cx('send-btn')}
                        aria-label='Send message'
                    >
                        {isLoading ? (
                            <HiArrowPath className={cx('loading-icon')} />
                        ) : (
                            <HiPaperAirplane className={cx('send-icon')} />
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ChatAIAssistant
