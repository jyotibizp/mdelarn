# E-Learning Platform MVP Specification

## 1. MVP Overview

This MVP focuses on delivering a functional e-learning platform with essential features that provide immediate value to users. The goal is to create a usable system that can display course content effectively while maintaining a clear upgrade path.

## 2. Core MVP Features

### 2.1 Left Sidebar - Basic Course Navigation

#### 2.1.1 Essential Structure
- **Simple Tree View**: Basic expandable/collapsible folder structure
- **Course Hierarchy Display**:
  - Course root folder
  - Module folders (numbered: 0-intro, 1-fundamentals, etc.)
  - Content files within modules
- **Basic Icons**: Simple folder 📁 and file 📄 icons only
- **Click Navigation**: Single-click to open content

#### 2.1.2 Minimal Interactive Features
- **Expand/Collapse**: Click folders to show/hide contents
- **Active Item Highlight**: Visual indication of currently selected content
- **Fixed Width Sidebar**: Static 300px width panel

### 2.2 Center Canvas - Basic Content Display

#### 2.2.1 Core Content Rendering
- **Markdown Display**: 
  - Basic markdown-to-HTML conversion
  - Support for headers, paragraphs, lists, links
  - Simple code block display (no syntax highlighting)
- **Plain Text Files**: Display as-is in monospace font
- **Directory Listing**: Show folder contents as clickable list

#### 2.2.2 Essential Media Support
- **Images**: Basic inline image display
- **External Links**: Clickable links that open in new tab
- **File Downloads**: Direct download links for non-displayable files

### 2.3 Simplified Course Structure Support

#### 2.3.1 File System Mapping
- **Direct Directory Structure**: 1:1 mapping with file system
- **Supported Structure**:
```
course-name/
├── 0-module/
│   ├── lesson.md
│   ├── exercise.md
│   └── solution.md
├── 1-module/
│   ├── lessons/
│   │   ├── lesson-01.md
│   │   └── lesson-02.md
│   └── exercises/
├── README.md
└── syllabus.md
```

#### 2.3.2 Content Types
- **Markdown Files (.md)**: Primary content format
- **Text Files (.txt)**: Additional documentation
- **Folders**: Organizational structure
- **README Recognition**: Display README.md by default when folder selected

## 3. MVP Technical Requirements

### 3.1 Essential Technology Stack
- **Frontend**: HTML, CSS, JavaScript (vanilla or simple framework)
- **Content Loading**: Fetch API for file retrieval
- **Markdown Parser**: Lightweight library (e.g., marked.js)
- **File System**: Static file serving or simple API

### 3.2 Basic Architecture
```
┌─────────────────┬──────────────────────┐
│   Sidebar       │   Content Canvas     │
│   Component     │   Component          │
│                 │                      │
│ ┌─────────────┐ │ ┌──────────────────┐ │
│ │ Course Tree │ │ │ Content Renderer │ │
│ │             │ │ │                  │ │
│ │ - Folders   │ │ │ - Markdown       │ │
│ │ - Files     │ │ │ - Text           │ │
│ │ - Click     │ │ │ - Images         │ │
│ │   Handler   │ │ │                  │ │
│ └─────────────┘ │ └──────────────────┘ │
└─────────────────┴──────────────────────┘
```

### 3.3 Minimal Data Requirements
- **Course Index**: Simple JSON with file paths and types
- **Current State**: Track currently selected content
- **Basic Config**: Course name, root path

## 4. MVP User Experience

### 4.1 Core User Flow
1. **Load Course**: Platform displays course structure in sidebar
2. **Browse Content**: User clicks folders to expand, files to view
3. **View Content**: Selected content displays in center canvas
4. **Navigate**: User can click different files to switch content

### 4.2 Essential UI Elements
- **Layout**: Fixed two-column layout (sidebar + content)
- **Navigation**: Simple click-based file selection
- **Content Display**: Scrollable content area
- **Basic Styling**: Clean, minimal design

### 4.3 Responsive Considerations
- **Desktop First**: Optimized for desktop/laptop screens
- **Mobile Fallback**: Stack sidebar above content on small screens

## 5. MVP Implementation Scope

### 5.1 What's Included ✅
- Basic file tree navigation
- Markdown content rendering
- Image display
- Folder/file organization
- Simple, clean UI
- Core navigation functionality

### 5.2 What's Excluded for MVP ❌
- **Advanced Features**:
  - Search functionality
  - Progress tracking
  - Bookmarks
  - User accounts
- **Rich Content**:
  - Video players
  - Code syntax highlighting
  - Interactive elements
  - Math formulas
- **UX Enhancements**:
  - Themes
  - Customizable layouts
  - Keyboard shortcuts
  - Advanced accessibility

## 6. MVP Development Phases

### Phase 1: Core Structure (Week 1)
- [ ] Basic HTML layout (sidebar + content area)
- [ ] CSS for two-column layout
- [ ] JavaScript file tree component
- [ ] Basic click navigation

### Phase 2: Content Rendering (Week 1)
- [ ] Markdown parser integration
- [ ] Content display component
- [ ] Image loading
- [ ] Basic styling for content

### Phase 3: Integration & Polish (Week 1)
- [ ] Connect sidebar navigation to content display
- [ ] Handle different file types
- [ ] Basic error handling
- [ ] Simple loading states

## 7. MVP Success Criteria

### 7.1 Functional Requirements
- ✅ Users can navigate course folder structure
- ✅ Users can view markdown content with proper formatting
- ✅ Images display correctly within content
- ✅ Platform works on desktop browsers (Chrome, Firefox, Safari)

### 7.2 Performance Benchmarks
- Content loads within 3 seconds
- Smooth navigation between files
- Responsive UI interactions

### 7.3 User Validation
- Users can complete basic learning workflow:
  1. Find desired lesson
  2. Read content
  3. Navigate to next item
  4. View exercises/solutions

## 8. Post-MVP Upgrade Path

### Immediate Next Features (v1.1)
- Code syntax highlighting
- Better mobile responsive design
- Basic search within current course

### Short-term Enhancements (v1.2-1.3)
- Progress tracking
- Video content support
- Improved navigation (breadcrumbs, next/prev)

### Long-term Features (v2.0+)
- User accounts and progress persistence
- Advanced search across all content
- Interactive exercises
- Social features

## 9. MVP Resource Requirements

### Development Time
- **Total Estimate**: 2-3 weeks
- **Team Size**: 1-2 developers
- **Skills Needed**: HTML/CSS/JavaScript, basic backend (if needed)

### Technical Infrastructure
- **Hosting**: Static file hosting (GitHub Pages, Netlify, etc.)
- **Storage**: File system or simple cloud storage
- **Dependencies**: Minimal (markdown parser, basic CSS framework optional)

This MVP provides a solid foundation for an e-learning platform while keeping complexity low and development time minimal. Users get immediate value from structured course navigation and content viewing, with a clear path for future enhancements.