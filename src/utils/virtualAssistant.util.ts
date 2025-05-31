/**
 * Utility functions for Virtual Assistant component
 */

/**
 * Generate fallback response when AI is unavailable
 * @param userInput - The user's input message
 * @returns A formatted response string with appropriate fallback content
 */
export const generateFallbackResponse = (userInput: string): string => {
    const input = userInput.toLowerCase()

    if (input.includes('tìm') || input.includes('tìm kiếm') || input.includes('search')) {
        return '🔍 **Tìm kiếm bài viết**\n\nBạn có thể sử dụng thanh tìm kiếm ở đầu trang để tìm kiếm bài viết. Chỉ cần nhập từ khóa mà bạn quan tâm và hệ thống sẽ hiển thị các bài viết liên quan.\n\n💡 *Mẹo: Sử dụng từ khóa cụ thể để có kết quả tìm kiếm chính xác hơn!*'
    }

    if (input.includes('đăng nhập') || input.includes('login') || input.includes('đăng ký')) {
        return '🔐 **Đăng nhập & Đăng ký**\n\nĐể đăng nhập hoặc đăng ký tài khoản:\n• Click vào nút "Đăng nhập" ở góc phải trên của trang web\n• Nếu chưa có tài khoản, bạn có thể tạo tài khoản mới tại đó\n• Hỗ trợ đăng nhập bằng email hoặc mạng xã hội'
    }

    if (input.includes('viết bài') || input.includes('tạo bài') || input.includes('đăng bài')) {
        return '✍️ **Viết bài mới**\n\nĐể tạo bài viết mới:\n1. Đăng nhập vào tài khoản của bạn\n2. Click vào nút "Tạo bài viết"\n3. Hoặc truy cập trang Profile để quản lý bài viết\n\n📝 *Bạn có thể sử dụng editor với nhiều tính năng định dạng văn bản!*'
    }

    if (input.includes('like') || input.includes('thích') || input.includes('yêu thích')) {
        return '❤️ **Tương tác bài viết**\n\nBạn có thể like/unlike bài viết bằng cách:\n• Click vào icon trái tim ❤️ bên cạnh bài viết\n• Cần đăng nhập để sử dụng tính năng này\n• Theo dõi số lượt thích trong thời gian thực'
    }

    if (input.includes('comment') || input.includes('bình luận') || input.includes('nhận xét')) {
        return '💬 **Bình luận & Thảo luận**\n\nĐể tham gia thảo luận:\n• Cuộn xuống cuối bài viết\n• Sử dụng hộp bình luận để viết ý kiến\n• Trả lời bình luận của người khác\n• Tạo chuỗi thảo luận sôi nổi'
    }

    if (input.includes('category') || input.includes('danh mục') || input.includes('chủ đề')) {
        return '📂 **Danh mục bài viết**\n\nLọc bài viết theo chủ đề:\n• Sử dụng các tab danh mục trên trang chủ\n• Mỗi danh mục hiển thị bài viết liên quan\n• Dễ dàng tìm nội dung bạn quan tâm\n\n🏷️ *Có nhiều danh mục đa dạng cho bạn lựa chọn!*'
    }

    if (input.includes('profile') || input.includes('hồ sơ') || input.includes('thông tin cá nhân')) {
        return '👤 **Quản lý hồ sơ**\n\nCập nhật thông tin cá nhân:\n• Click vào avatar ở góc phải trên\n• Chọn "Hồ sơ" hoặc "Cài đặt"\n• Cập nhật thông tin, thay đổi avatar\n• Quản lý các bài viết của bạn\n\n✨ *Tạo hồ sơ ấn tượng để thu hút độc giả!*'
    }

    if (input.includes('help') || input.includes('hỗ trợ') || input.includes('giúp đỡ')) {
        return '🤝 **Hỗ trợ toàn diện**\n\nTôi có thể giúp bạn:\n• 🔍 Tìm kiếm bài viết\n• 📖 Hướng dẫn sử dụng website\n• ✍️ Viết và đăng bài\n• 💬 Tương tác với cộng đồng\n• ⚙️ Cài đặt tài khoản\n\n💡 *Hãy hỏi tôi bất cứ điều gì bạn cần!*'
    }

    if (input.includes('chào') || input.includes('hello') || input.includes('hi')) {
        return '👋 **Xin chào bạn!**\n\nRất vui được gặp bạn! Tôi là trợ lý ảo của blog này.\n\n🤖 Tôi có thể giúp bạn:\n• Điều hướng website\n• Tìm kiếm thông tin\n• Giải đáp thắc mắc\n• Hướng dẫn sử dụng tính năng\n\n❓ Bạn muốn tôi hỗ trợ gì hôm nay?'
    }

    if (input.includes('cảm ơn') || input.includes('thank')) {
        return '🙏 **Không có gì!**\n\nTôi luôn sẵn sàng hỗ trợ bạn!\n\n✨ Nếu bạn còn câu hỏi nào khác, đừng ngần ngại hỏi tôi nhé!\n\n💝 *Chúc bạn có trải nghiệm tuyệt vời trên website!*'
    }

    // Default responses when AI is unavailable
    const defaultResponses = [
        '🔌 **Kết nối AI tạm thời gián đoạn**\n\nXin lỗi, tôi đang gặp sự cố kết nối với AI. Tuy nhiên, tôi vẫn có thể hỗ trợ bạn về:\n• 🔍 Tìm kiếm bài viết\n• 📖 Hướng dẫn sử dụng website\n• ⚙️ Các tính năng cơ bản\n\n💡 *Hãy thử lại sau hoặc hỏi tôi về các chức năng khác!*',

        '🤖 **Chế độ offline**\n\nHiện tại tôi không thể kết nối với AI, nhưng tôi có thể hỗ trợ bạn về:\n• 🔍 Tìm kiếm và điều hướng\n• 🔐 Đăng nhập và đăng ký\n• ✍️ Viết bài và tương tác\n• 💬 Bình luận và thảo luận\n\n🔄 *Hệ thống sẽ tự động kết nối lại!*',

        '⚡ **Dịch vụ AI tạm thời gián đoạn**\n\nTôi đang trong chế độ hỗ trợ cơ bản. Có thể giúp bạn về:\n• 📚 Sử dụng các tính năng website\n• 🎯 Tìm nội dung phù hợp\n• 👥 Tương tác với cộng đồng\n\n🚀 *AI sẽ sớm hoạt động trở lại để hỗ trợ tốt hơn!*'
    ]

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
}

/**
 * Format message text with proper line breaks for display
 * @param text - The message text to format
 * @returns Array of text parts split by line breaks
 */
export const formatMessageText = (text: string): string[] => {
    return text.split('\n')
}

/**
 * Auto-resize textarea based on content
 * @param textarea - The textarea element
 * @param maxHeight - Maximum height in pixels (default: 120)
 */
export const autoResizeTextarea = (textarea: HTMLTextAreaElement, maxHeight: number = 120) => {
    textarea.style.height = 'auto'
    textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`
}
