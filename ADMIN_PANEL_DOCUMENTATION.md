# Admin Panel Documentation

## Overview

This comprehensive admin panel is designed for managing a multilingual nonprofit/charity website built with Next.js and React. The panel provides complete content management, user administration, analytics, and system configuration capabilities.

## Architecture & Technology Stack

### Frontend Framework
- **Next.js 14+** - React framework with App Router
- **React 18+** - Component-based UI library
- **TypeScript/JavaScript** - Primary programming language

### UI & Styling
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Component library built on Radix UI
- **GSAP** - Animation library for smooth transitions
- **Lucide React** - Icon library

### State Management
- **React Context API** - Global state management
- **Custom Hooks** - Data fetching and UI state logic
- **React Hooks** - Local component state

### Backend & Database
- **Supabase** - Backend-as-a-Service (authentication, database)
- **REST API** - Custom API routes for data operations
- **PostgreSQL** - Database (via Supabase)

### Internationalization
- **next-intl** - Internationalization framework
- **Multi-language Support** - English, French, Arabic

## Directory Structure

```
components/admin/
├── AdminDashboard.jsx           # Main dashboard orchestrator
├── AdminLayout.jsx              # Layout with sidebar and header
├── MultiLanguageTabs.jsx        # Language switching component
├── SeedDataButton.jsx           # Development data seeding
├── admins/                      # Admin user management
│   ├── AdminList.jsx
│   ├── AdminModal.jsx
│   └── ...
├── analytics/                   # Analytics and reporting
│   ├── AnalyticsCharts.jsx
│   ├── AnalyticsMetrics.jsx
│   ├── AnalyticsOverview.jsx
│   └── AnalyticsSummary.jsx
├── blogs/                       # Blog content management
│   ├── BlogFilters.jsx
│   ├── BlogForm.jsx
│   ├── BlogList.jsx
│   └── BlogManager.jsx
├── comments/                    # Comment moderation
│   ├── CommentFilters.jsx
│   ├── CommentForm.jsx
│   ├── CommentList.jsx
│   └── CommentManager.jsx
├── dashboard/                   # Dashboard overview
│   └── DashboardOverview.jsx
├── messages/                    # Contact messages
│   ├── MessageFilters.jsx
│   ├── MessageForm.jsx
│   ├── MessageList.jsx
│   └── MessageManager.jsx
├── projects/                    # Project management
│   ├── ProjectForm.jsx
│   ├── ProjectList.jsx
│   └── ProjectManager.jsx
└── settings/                    # System settings
    ├── AppearanceSettings.jsx
    ├── EmailSettings.jsx
    ├── GeneralSettings.jsx
    ├── SecuritySettings.jsx
    └── SettingsOverview.jsx

hooks/admin/
├── useAdminContext.js           # Admin state management
├── useAdminData.js              # Admin CRUD operations
├── useAdminNavigation.js        # Navigation state
├── useAdminTheme.js             # Theme management
├── useAdminUI.js                # UI state management
├── useBlogData.js               # Blog data operations
├── useCommentsData.js           # Comments data
├── useMessagesData.js           # Messages data
└── useProjectData.js            # Project data

controllers/
├── adminsController.js          # Admin API logic
├── analyticsController.js       # Analytics API
├── blogPostsController.js       # Blog API
├── commentsController.js        # Comments API
├── dashboardController.js       # Dashboard metrics
├── messagesController.js        # Messages API
├── projectImagesController.js   # Project images API
├── projectsController.js        # Projects API
└── siteConfigController.js      # Site configuration

app/api/
├── admins/                      # Admin management endpoints
├── analytics/                   # Analytics data endpoints
├── blog-posts/                  # Blog CRUD operations
├── comments/                    # Comment management
├── dashboard/                   # Dashboard metrics
├── messages/                    # Contact messages
├── project-images/              # Project gallery images
└── projects/                    # Project management
```

## Core Features

### 1. Dashboard Overview

**Location**: `components/admin/dashboard/DashboardOverview.jsx`

**Features**:
- Real-time metrics display (Projects, Blog Posts, Comments, Messages, Admins, Images)
- Animated counter displays with GSAP
- Recent activities table
- Refresh functionality
- Responsive grid layout
- Loading states and error handling

**API Endpoint**: `/api/dashboard/metrics`

**Metrics Tracked**:
- Total Projects
- Total Blog Posts
- Total Comments
- Total Messages
- Total Admins
- Total Project Images

### 2. Admin User Management

**Location**: `components/admin/admins/`

**Features**:
- Admin user listing with table view
- Create/Edit/Delete admin users
- Invitation link generation
- Role-based access control
- Modal-based forms
- Real-time data updates

**Key Components**:
- `AdminList.jsx` - User table with actions
- `AdminModal.jsx` - Create/edit modal with invitation system
- `useAdminContext.js` - State management

**API Endpoints**:
- `GET/POST /api/admins` - List/Create admins
- `PUT/DELETE /api/admins/[id]` - Update/Delete specific admin

### 3. Blog Content Management

**Location**: `components/admin/blogs/`

**Features**:
- Full CRUD operations for blog posts
- Advanced filtering and search
- Multilingual content support (EN/FR/AR)
- Rich text editing capabilities
- Category and status management
- Pagination support

**Key Components**:
- `BlogManager.jsx` - Main container component
- `BlogList.jsx` - Posts table with filters
- `BlogForm.jsx` - Create/edit form with multi-language tabs
- `BlogFilters.jsx` - Search and filter controls

**API Endpoints**:
- `GET/POST /api/blog-posts` - List/Create posts
- `PUT/DELETE /api/blog-posts/[id]` - Update/Delete posts
- `GET/POST /api/blog-posts/[id]/translations` - Translation management

### 4. Comment Moderation System

**Location**: `components/admin/comments/`

**Features**:
- Comment listing and filtering
- Approval/rejection workflow
- Bulk operations
- Real-time updates
- Search functionality

**Key Components**:
- `CommentManager.jsx` - Main comment interface
- `CommentList.jsx` - Comment table
- `CommentFilters.jsx` - Filter controls
- `CommentForm.jsx` - Comment editing

**API Endpoints**:
- `GET /api/comments` - List comments
- `PUT/DELETE /api/comments/[id]` - Update/Delete comments

### 5. Contact Message Management

**Location**: `components/admin/messages/`

**Features**:
- Contact form message listing
- Message filtering and search
- Read/unread status management
- Message details view
- Bulk operations

**Key Components**:
- `MessageManager.jsx` - Main message interface
- `MessageList.jsx` - Message table
- `MessageFilters.jsx` - Filter controls
- `MessageForm.jsx` - Message viewing/editing

**API Endpoints**:
- `GET /api/messages` - List messages
- `PUT/DELETE /api/messages/[id]` - Update/Delete messages

### 6. Project Management System

**Location**: `components/admin/projects/`

**Overview**:
The Project Management System is one of the most sophisticated features of the admin panel, designed for managing complex nonprofit/charity projects with full multilingual support (French, English, Arabic) and advanced content structuring capabilities.

**Core Features**:
- **Multilingual Content Management**: Complete project information in three languages
- **Advanced Content Blocks System**: 8 different block types for rich content creation
- **Gallery Image Management**: Local image upload and management system
- **Dynamic Form Validation**: Real-time validation with multilingual error handling
- **Auto-generated Slugs**: SEO-friendly URL generation from titles
- **Categorization System**: Multi-select categories with custom options
- **Project Goals Management**: Structured goal tracking and management
- **Translation Export/Import**: Batch translation management system

#### Form Structure & Sections

**1. Multilingual Content Tabs**
- **Language Support**: French (required), English, Arabic (RTL support)
- **Validation Rules**:
  - French title and excerpt are mandatory
  - English/Arabic require both title and excerpt if either is provided
  - Real-time validation with contextual error messages

**2. Shared Fields Section**
- **Slug Generation**: Auto-generated from French title with uniqueness validation
- **Status Management**: Draft/Published workflow
- **Project Metadata**:
  - Start Date (month/year picker)
  - Location (geographic information)
  - People Helped (impact metrics)
- **Categorization**: Multi-select with custom category creation
- **Goals Management**: Dynamic goal list with add/remove functionality

**3. Content Blocks System**

The Content Blocks Editor provides 8 specialized block types for creating rich, structured project content:

- **Text Block**: Simple content with heading and description
- **Services Block**: Categorized service offerings with descriptions
- **Stats Block**: Key metrics and statistics display
- **Programme Block**: Educational programmes with modules and duration
- **Impact Block**: Impact metrics with descriptions and values
- **Sponsorship Block**: Sponsorship formulas and monetary amounts
- **Timeline Block**: Project timeline with events and years
- **List Block**: Organized lists with titles and descriptions

**Features of Content Blocks**:
- **Visual Preview**: Real-time preview of all content blocks
- **Block Statistics**: Live count of each block type used
- **Drag & Drop Interface**: Intuitive content organization
- **Validation**: Required fields for each block type
- **Multilingual Support**: Each block translatable to all languages

**4. Gallery Image Management**
- **Local Upload System**: Client-side image management
- **Bulk Operations**: Multiple image upload and management
- **Image Organization**: Project-specific gallery collections
- **Preview & Editing**: Image preview before final save

#### Key Components

**ProjectManager.jsx**
- Main orchestrator component
- State management integration with `useProjectData` hook
- Smooth animations between list and form views
- Error handling and loading states

**ProjectForm.jsx**
- Complex multilingual form component
- 600+ lines of sophisticated form logic
- Real-time validation and error display
- Auto-slug generation and uniqueness checking
- GSAP-powered animations and transitions

**ProjectList.jsx**
- Advanced data table with sorting and filtering
- Bulk operations support
- Status indicators and quick actions
- Responsive design for mobile devices

#### Data Management

**Project Data Hook (`useProjectData.js`)**
- Comprehensive CRUD operations
- Client-side validation with multilingual support
- Form state management
- Error handling with toast notifications
- Array field management (categories, goals, content blocks)

**Project Utilities (`projectUtils.js`)**
- Multilingual content transformation
- Translation status checking
- Localized content retrieval
- Translation export/import support

#### Translation System

**Translation Workflow**:
1. **Primary Content**: Created in French (required)
2. **Translation Export**: JSON files generated for translators
3. **Translation Import**: Translated content merged back
4. **Content Transformation**: Translation data mapped to content blocks

**Translation Files Structure**:
```
project-translations/
├── centre-himaya.json
├── fataer-al-baraka.json
├── jardin-enfants-rihana.json
└── ...
```

**Translation Scripts**:
- `exportProjectsForTranslation.js`: Export projects for translation
- `importProjectTranslations.js`: Import completed translations

#### API Architecture

**Project CRUD Endpoints**:
- `GET /api/projects` - List all projects with pagination
- `POST /api/projects` - Create new project
- `GET /api/projects/[id]` - Get specific project
- `PUT /api/projects/[id]` - Update project
- `DELETE /api/projects/[id]` - Delete project

**Image Management Endpoints**:
- `GET /api/project-images` - List project images
- `POST /api/project-images` - Upload project images
- `PUT /api/project-images/[id]` - Update image metadata
- `DELETE /api/project-images/[id]` - Delete project image

**Translation Endpoints**:
- `GET /api/projects/[id]/translations` - Get translation data
- `POST /api/projects/[id]/translations` - Update translations

#### Advanced Features

**1. Content Block Types & Usage**

| Block Type | Purpose | Key Fields | Use Case |
|------------|---------|------------|----------|
| **Text** | General content | Heading, Text | Project descriptions, introductions |
| **Services** | Service offerings | Categories, Services, Descriptions | What the project provides |
| **Stats** | Metrics display | Labels, Values | Impact measurements, statistics |
| **Programme** | Educational content | Modules, Duration | Training programmes, courses |
| **Impact** | Results showcase | Descriptions, Values | Project outcomes, achievements |
| **Sponsorship** | Funding info | Formulas, Amounts | Sponsorship opportunities |
| **Timeline** | Project history | Events, Years | Project milestones, history |
| **List** | Structured lists | Items, Descriptions | Features, benefits, requirements |

**2. Multilingual Form Validation**
- **French**: Mandatory for all core fields
- **English/Arabic**: Optional but complete (both title + excerpt required if started)
- **Content Blocks**: Validated per language
- **Real-time Feedback**: Immediate error clearing on user input

**3. Gallery Management Features**
- **Local Storage**: Images managed client-side before upload
- **Project Association**: Images linked to specific projects
- **Bulk Upload**: Multiple image selection and upload
- **Preview System**: Image thumbnails and full previews

**4. SEO Optimization**
- **Auto-generated Slugs**: URL-friendly identifiers from titles
- **Uniqueness Validation**: Prevents duplicate slugs
- **Multilingual URLs**: Language-specific project URLs

#### Database Schema

**Projects Table Structure**:
```sql
projects {
  id: primary_key
  slug: unique_string
  status: enum(draft, published)

  -- Multilingual Fields
  title: string
  title_en: string
  title_ar: string
  excerpt: string
  excerpt_en: string
  excerpt_ar: string
  people_helped: string
  people_helped_en: string
  people_helped_ar: string

  -- Structured Data
  categories: json_array
  goals: json_array
  content: json_array
  content_en: json_translations
  content_ar: json_translations

  -- Metadata
  start_date: string
  location: string
  image: string
  gallery_images: json_array

  -- Timestamps
  created_at: timestamp
  updated_at: timestamp
}
```

#### Performance Considerations

**Optimization Features**:
- **Lazy Loading**: Components loaded on demand
- **Memoization**: Expensive calculations cached
- **Debounced Validation**: Input validation optimized
- **Efficient Re-renders**: Controlled component updates

**Scalability Features**:
- **Pagination**: Large project lists handled efficiently
- **Image Optimization**: Responsive image loading
- **Translation Caching**: Translation data cached for performance

#### Integration Points

**Frontend Integration**:
- **Project Display Pages**: Public project detail pages
- **Gallery Components**: Image gallery viewers
- **Content Renderers**: Block-based content display
- **Navigation Systems**: Multilingual project navigation

**External Systems**:
- **Translation Services**: Integration with translation platforms
- **Image CDNs**: Cloud image storage and delivery
- **Analytics Platforms**: Project performance tracking

### 7. Analytics & Reporting

**Location**: `components/admin/analytics/`

**Features**:
- Comprehensive analytics dashboard
- Interactive charts and graphs
- Key performance metrics
- Activity summaries
- Category-based analytics

**Key Components**:
- `AnalyticsOverview.jsx` - Main analytics view
- `AnalyticsCharts.jsx` - Chart visualizations
- `AnalyticsMetrics.jsx` - Key metrics display
- `AnalyticsSummary.jsx` - Activity summaries

**API Endpoints**:
- `/api/analytics/overview` - General analytics
- `/api/analytics/charts` - Chart data
- `/api/analytics/metrics` - Key metrics
- `/api/analytics/summary` - Activity summaries
- `/api/analytics/categories` - Category analytics

### 8. System Settings

**Location**: `components/admin/settings/`

**Features**:
- General site configuration
- Email settings
- Security configuration
- Appearance customization

**Settings Sections**:
- **General Settings**: Site information, contact details
- **Email Settings**: SMTP configuration, notification settings
- **Security Settings**: Authentication, access control
- **Appearance Settings**: Theme customization, UI preferences

## State Management Architecture

### Context Providers
- **AdminProvider**: Global admin state management
- **AdminContext**: Admin user operations and UI state

### Custom Hooks
- **useAdminNavigation**: Navigation state and menu management
- **useAdminTheme**: Dark/light mode management
- **useAdminUI**: UI state management (modals, forms)
- **useBlogData**: Blog CRUD operations
- **useProjectData**: Project CRUD operations
- **useCommentsData**: Comment management
- **useMessagesData**: Message management

### Data Flow Pattern
```
Component → Custom Hook → API Call → Controller → Database
                     ↓
              Context Update → UI Re-render
```

## API Architecture

### REST API Structure
All API endpoints follow RESTful conventions:

```
GET    /api/[resource]          # List resources
POST   /api/[resource]          # Create resource
GET    /api/[resource]/[id]     # Get specific resource
PUT    /api/[resource]/[id]     # Update resource
DELETE /api/[resource]/[id]     # Delete resource
```

### Controllers
Each controller handles business logic for specific domains:
- Data validation
- Database operations
- Error handling
- Response formatting

### Error Handling
- Consistent error response format
- HTTP status codes
- User-friendly error messages
- Logging for debugging

## UI/UX Features

### Design System
- **Dark/Light Theme**: Complete theme switching
- **Responsive Design**: Mobile-first approach
- **Consistent Components**: Reusable UI components
- **Loading States**: Skeleton loaders and spinners
- **Error States**: User-friendly error displays

### Animations
- **GSAP Integration**: Smooth page transitions
- **Hover Effects**: Interactive feedback
- **Loading Animations**: Engaging loading experiences
- **Entrance Animations**: Staggered content reveals

### Accessibility
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader Support**: ARIA labels and roles
- **Color Contrast**: WCAG compliant colors
- **Focus Management**: Proper focus indicators

## Internationalization (i18n)

### Supported Languages
- **English (en)**
- **French (fr)**
- **Arabic (ar)** - RTL support

### Implementation
- **next-intl**: Client and server-side translation
- **Message Files**: JSON-based translation files
- **Dynamic Loading**: Language switching without reload
- **Route-based Localization**: `/[locale]/admin`

### Translation Files
```
messages/
├── en.json    # English translations
├── fr.json    # French translations
└── ar.json    # Arabic translations
```

## Security Features

### Authentication
- **Supabase Auth**: Secure authentication system
- **Role-based Access**: Admin role verification
- **Session Management**: Automatic token refresh

### Data Protection
- **Input Validation**: Client and server-side validation
- **SQL Injection Prevention**: Parameterized queries
- **XSS Protection**: Sanitized inputs
- **CSRF Protection**: Token-based protection

### Access Control
- **Route Protection**: Admin-only routes
- **API Authorization**: Token-based API access
- **Permission Checks**: Granular permissions

## Development & Deployment

### Environment Setup
```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Key Dependencies
```json
{
  "next": "^14.x.x",
  "react": "^18.x.x",
  "@supabase/supabase-js": "^2.x.x",
  "gsap": "^3.x.x",
  "tailwindcss": "^3.x.x",
  "@radix-ui/react-*": "Various UI components",
  "next-intl": "^3.x.x"
}
```

### Database Schema
- **Admins Table**: User management
- **Blog Posts Table**: Content management
- **Comments Table**: User interactions
- **Messages Table**: Contact forms
- **Projects Table**: Project data
- **Project Images Table**: Gallery management

## Performance Optimizations

### Code Splitting
- **Dynamic Imports**: Lazy loading of components
- **Route-based Splitting**: Automatic code splitting

### Caching Strategy
- **API Response Caching**: Reduce server load
- **Static Asset Caching**: Optimized asset delivery
- **Database Query Optimization**: Efficient queries

### Image Optimization
- **Next.js Image Component**: Automatic optimization
- **Responsive Images**: Multiple sizes
- **WebP Format**: Modern image formats

## Testing Strategy

### Component Testing
- **Unit Tests**: Individual component testing
- **Integration Tests**: Component interaction testing
- **E2E Tests**: Full user workflow testing

### API Testing
- **Endpoint Testing**: API functionality validation
- **Error Handling**: Edge case testing
- **Performance Testing**: Load testing

## Maintenance & Updates

### Code Organization
- **Modular Architecture**: Easy to maintain and extend
- **Consistent Patterns**: Standardized coding practices
- **Documentation**: Comprehensive inline documentation

### Monitoring
- **Error Tracking**: Sentry integration
- **Performance Monitoring**: Real user monitoring
- **Analytics**: Usage tracking

### Backup & Recovery
- **Database Backups**: Automated backup system
- **Content Backup**: File system backups
- **Recovery Procedures**: Documented recovery steps

## Future Enhancements

### Planned Features
- **Real-time Notifications**: WebSocket integration
- **Advanced Analytics**: Machine learning insights
- **Bulk Operations**: Mass data operations
- **API Rate Limiting**: Request throttling
- **Audit Logs**: Complete activity tracking

### Scalability Improvements
- **Microservices Architecture**: Service separation
- **CDN Integration**: Global content delivery
- **Database Sharding**: Horizontal scaling
- **Caching Layer**: Redis integration

## Troubleshooting

### Common Issues
- **Authentication Problems**: Check Supabase configuration
- **API Errors**: Verify environment variables
- **Theme Issues**: Clear browser cache
- **Performance Issues**: Check network and database

### Debug Mode
- **Development Logs**: Console debugging
- **Error Boundaries**: Graceful error handling
- **Debug Tools**: React DevTools integration

## Support & Documentation

### Developer Resources
- **API Documentation**: Endpoint specifications
- **Component Library**: Reusable component documentation
- **Style Guide**: Design system documentation

### Community
- **Issue Tracking**: GitHub issues
- **Discussion Forum**: Developer discussions
- **Documentation Wiki**: Community-contributed guides

---

This admin panel represents a modern, scalable solution for nonprofit website management with comprehensive features for content management, user administration, analytics, and system configuration.
