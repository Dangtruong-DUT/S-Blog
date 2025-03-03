# S-Blog

Blog system with modern features and beautiful UI.

## Project Structure

```
S-Blog/
├── frontend/          # React application
│   ├── public/
│   └── src/
│       ├── assets/           # Images, icons, fonts
│       ├── components/       # Shared components
│       │   ├── common/      # Common components (Button, Input, etc.)
│       │   ├── layout/      # Layout components
│       │   └── ui/          # UI components
│       ├── features/        # Feature-based components
│       │   ├── auth/        # Authentication related
│       │   ├── blog/        # Blog related
│       │   └── user/        # User related
│       ├── hooks/           # Custom hooks
│       ├── locales/         # i18n translations
│       ├── pages/           # Page components
│       ├── services/        # API services
│       ├── store/           # Redux store
│       ├── styles/          # Global styles
│       ├── themes/          # Theme configurations
│       ├── types/           # TypeScript types
│       └── utils/           # Utility functions
│
├── backend/           # Express application
│   └── src/
│       ├── config/          # Configurations
│       │   ├── database.ts
│       │   └── env.ts
│       ├── controllers/     # Route controllers
│       │   ├── auth/
│       │   ├── post/
│       │   └── user/
│       ├── middlewares/     # Custom middlewares
│       │   ├── auth/
│       │   └── validation/
│       ├── models/          # Database models
│       │   ├── User.ts
│       │   ├── Post.ts
│       │   └── Comment.ts
│       ├── routes/          # API routes
│       │   ├── auth.ts
│       │   ├── post.ts
│       │   └── user.ts
│       ├── services/        # Business logic
│       ├── types/          # TypeScript types
│       └── utils/          # Utility functions
```

## Features

### User Management
- Registration/Login with email, password or OAuth (Google, Facebook)
- Password recovery via email
- Profile management (username, avatar, bio)
- Account deletion

### Blog Management
- Create posts with title, content (Markdown support), images, tags, hashtags
- Edit/Delete posts
- View posts by user

### Post Interaction
- Like posts
- Comment system with replies
- Bookmark posts

### Statistics & Tracking
- Blog visit statistics (daily, monthly, yearly)
- Post likes count
- Bookmark count

### Additional Features
- Search posts by title, tags, hashtags
- Post categorization by tags, hashtags
- Post recommendations based on preferences
- Dark Mode support
- Multi-language support

## Technical Requirements

### Frontend
- Responsive design (mobile, tablet, desktop)
- SEO optimization
- Accessibility support
- Dark Mode
- Multi-language support

### Backend
- ExpressJS with TypeScript
- JWT Authentication
- REST API
- Realtime features with Socket.IO

### Database
- MongoDB with Mongoose

## Getting Started

1. Clone the repository
```bash
git clone https://github.com/Dangtruong-DUT/S-Blog.git
cd S-Blog
```

2. Install dependencies
```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

3. Set up environment variables
```bash
# Backend
cp .env.example .env
# Edit .env with your configurations
```

4. Run the application
```bash
# Frontend
cd frontend
npm start

# Backend
cd backend
npm run dev
```

## Design System
The UI follows the design system from [Figma](https://www.figma.com/design/jxtgVCFmtRdq23YUj3Ijkt/S-Blog?node-id=0-1&p=f&m=dev) 