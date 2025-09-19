# E-Learning Platform - Technical Architecture Document

## System Architecture Overview

### High-Level Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
│                      React Application                       │
│                    (JavaScript/JSX + Vite)                   │
└─────────────────────────────────────────────────────────────┘
                               ↕
┌─────────────────────────────────────────────────────────────┐
│                          API Layer                           │
│                     FastAPI Application                      │
│                    (Python 3.11+ / Async)                   │
└─────────────────────────────────────────────────────────────┘
                               ↕
┌─────────────────────────────────────────────────────────────┐
│                        Data Layer                            │
│     SQLite Database          File System Storage            │
│    (Metadata & Config)        (Course Content)              │
└─────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Backend Stack
- **Framework**: FastAPI 0.104+
- **Python Version**: 3.11+
- **Database**: SQLite 3
- **ORM**: SQLAlchemy 2.0
- **Validation**: Pydantic v2
- **CORS**: FastAPI middleware
- **File Handling**: aiofiles
- **Markdown Parser**: Python-Markdown
- **Testing**: Pytest + pytest-asyncio

### Frontend Stack
- **Framework**: React 18.2+
- **Language**: JavaScript (ES6+) / JSX
- **Build Tool**: Vite 5.0+
- **State Management**: Redux Toolkit (RTK) + RTK Query
- **Routing**: React Router v6
- **UI Components**: Custom + Radix UI
- **Styling**: CSS Modules + Tailwind CSS
- **HTTP Client**: RTK Query (built-in)
- **Markdown Renderer**: react-markdown
- **Testing**: Vitest + React Testing Library
- **Prop Validation**: PropTypes

### Development Tools
- **Version Control**: Git
- **Package Management**: npm (frontend), pip/poetry (backend)
- **Linting**: ESLint (frontend), Ruff (backend)
- **Formatting**: Prettier (frontend), Black (backend)
- **Code Quality**: JSDoc comments (frontend)

## Backend Architecture

### FastAPI Application Structure
```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI app entry point
│   ├── config.py            # Configuration management
│   ├── database.py          # Database connection
│   ├── api/
│   │   ├── __init__.py
│   │   ├── routes/
│   │   │   ├── courses.py   # Course endpoints
│   │   │   ├── content.py   # Content delivery
│   │   │   └── health.py    # Health checks
│   │   └── dependencies.py  # Shared dependencies
│   ├── core/
│   │   ├── __init__.py
│   │   ├── security.py      # Security utilities
│   │   └── utils.py         # Helper functions
│   ├── models/
│   │   ├── __init__.py
│   │   ├── course.py        # SQLAlchemy models
│   │   └── content.py
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── course.py        # Pydantic schemas
│   │   └── content.py
│   ├── services/
│   │   ├── __init__.py
│   │   ├── course_service.py
│   │   ├── content_service.py
│   │   └── file_service.py
│   └── storage/
│       └── courses/          # Course file storage
├── tests/
├── alembic/                  # Database migrations
├── requirements.txt
└── .env.example
```

### API Endpoints

#### Course Management
```python
# Course structure and metadata
GET    /api/v1/courses                    # List all courses
GET    /api/v1/courses/{course_id}        # Get course details
GET    /api/v1/courses/{course_id}/structure  # Get course file tree

# Content delivery
GET    /api/v1/courses/{course_id}/content/*path  # Get file content
GET    /api/v1/courses/{course_id}/assets/*path   # Get static assets

# Health and monitoring
GET    /api/v1/health                     # Health check
GET    /api/v1/metrics                    # System metrics
```

### Database Schema

```sql
-- Courses table
CREATE TABLE courses (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    root_path TEXT NOT NULL,
    config JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Content metadata table
CREATE TABLE content_metadata (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_id TEXT NOT NULL,
    path TEXT NOT NULL,
    type TEXT NOT NULL,
    size INTEGER,
    checksum TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id),
    UNIQUE(course_id, path)
);

-- User progress tracking (future)
CREATE TABLE user_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    course_id TEXT NOT NULL,
    content_path TEXT NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    last_accessed TIMESTAMP,
    time_spent INTEGER DEFAULT 0,
    FOREIGN KEY (course_id) REFERENCES courses(id)
);
```

### Backend Services

#### CourseService
```python
class CourseService:
    async def list_courses() -> List[Course]
    async def get_course(course_id: str) -> Course
    async def get_course_structure(course_id: str) -> Dict
    async def scan_course_directory(path: str) -> Dict
```

#### ContentService
```python
class ContentService:
    async def get_content(course_id: str, path: str) -> Content
    async def parse_markdown(content: str) -> str
    async def get_file_metadata(file_path: str) -> Dict
```

#### FileService
```python
class FileService:
    async def read_file(path: str) -> bytes
    async def list_directory(path: str) -> List[str]
    async def get_mime_type(file_path: str) -> str
    async def validate_path(path: str) -> bool
```

## Frontend Architecture (JavaScript/JSX)

### React Application Structure
```
frontend/
├── src/
│   ├── main.jsx             # Application entry point
│   ├── App.jsx              # Root component
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Layout.jsx
│   │   │   ├── Header.jsx
│   │   │   └── Footer.jsx
│   │   ├── sidebar/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── FileTree.jsx
│   │   │   └── TreeNode.jsx
│   │   ├── content/
│   │   │   ├── ContentViewer.jsx
│   │   │   ├── MarkdownRenderer.jsx
│   │   │   └── CodeBlock.jsx
│   │   └── common/
│   │       ├── Loading.jsx
│   │       ├── ErrorBoundary.jsx
│   │       └── NotFound.jsx
│   ├── hooks/
│   │   ├── useCourse.js
│   │   ├── useContent.js
│   │   └── useLocalStorage.js
│   ├── services/
│   │   └── api/
│   │       ├── apiSlice.js      # RTK Query API slice
│   │       ├── courseApi.js     # Course endpoints
│   │       └── contentApi.js    # Content endpoints
│   ├── store/
│   │   ├── index.js             # Redux store configuration
│   │   ├── slices/
│   │   │   ├── courseSlice.js   # Course state
│   │   │   └── uiSlice.js       # UI state
│   │   └── middleware.js        # Custom middleware
│   ├── utils/
│   │   ├── constants.js
│   │   ├── helpers.js
│   │   └── propTypes.js    # Shared PropTypes
│   └── styles/
│       ├── globals.css
│       └── themes.css
├── public/
├── index.html
├── package.json
├── vite.config.js
├── .eslintrc.js
└── tailwind.config.js
```

### State Management (Redux Toolkit with JavaScript)

#### Redux Store Configuration
```javascript
// store/index.js
import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { apiSlice } from '../services/api/apiSlice'
import courseReducer from './slices/courseSlice'
import uiReducer from './slices/uiSlice'

export const store = configureStore({
  reducer: {
    // Add the RTK Query reducer
    [apiSlice.reducerPath]: apiSlice.reducer,
    // Add other reducers
    course: courseReducer,
    ui: uiReducer,
  },
  // Add the RTK Query middleware
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
})

// Enable refetchOnFocus/refetchOnReconnect behaviors
setupListeners(store.dispatch)
```

#### Course Slice
```javascript
// store/slices/courseSlice.js
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  currentCourse: null,
  courseStructure: null,
  currentPath: '',
  expandedNodes: [],
}

const courseSlice = createSlice({
  name: 'course',
  initialState,
  reducers: {
    setCurrentCourse: (state, action) => {
      state.currentCourse = action.payload
    },
    setCourseStructure: (state, action) => {
      state.courseStructure = action.payload
    },
    setCurrentPath: (state, action) => {
      state.currentPath = action.payload
    },
    toggleNode: (state, action) => {
      const path = action.payload
      const index = state.expandedNodes.indexOf(path)
      if (index > -1) {
        state.expandedNodes.splice(index, 1)
      } else {
        state.expandedNodes.push(path)
      }
    },
    clearCourseState: (state) => {
      return initialState
    }
  }
})

export const {
  setCurrentCourse,
  setCourseStructure,
  setCurrentPath,
  toggleNode,
  clearCourseState
} = courseSlice.actions

export default courseSlice.reducer
```

#### UI Slice
```javascript
// store/slices/uiSlice.js
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  sidebarOpen: true,
  loading: false,
  error: null,
  theme: 'light',
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    setTheme: (state, action) => {
      state.theme = action.payload
    },
    clearError: (state) => {
      state.error = null
    }
  }
})

export const {
  toggleSidebar,
  setLoading,
  setError,
  setTheme,
  clearError
} = uiSlice.actions

export default uiSlice.reducer
```

#### RTK Query API Slice
```javascript
// services/api/apiSlice.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}/api/v1`,
    prepareHeaders: (headers) => {
      // Add auth token if available
      const token = localStorage.getItem('token')
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ['Course', 'Content'],
  endpoints: (builder) => ({})
})
```

#### Course API Endpoints
```javascript
// services/api/courseApi.js
import { apiSlice } from './apiSlice'

export const courseApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCourses: builder.query({
      query: () => '/courses',
      providesTags: ['Course'],
    }),
    getCourse: builder.query({
      query: (courseId) => `/courses/${courseId}`,
      providesTags: (result, error, courseId) => [{ type: 'Course', id: courseId }],
    }),
    getCourseStructure: builder.query({
      query: (courseId) => `/courses/${courseId}/structure`,
      providesTags: (result, error, courseId) => [{ type: 'Course', id: `${courseId}-structure` }],
    }),
  }),
})

export const {
  useGetCoursesQuery,
  useGetCourseQuery,
  useGetCourseStructureQuery,
} = courseApi
```

#### Content API Endpoints
```javascript
// services/api/contentApi.js
import { apiSlice } from './apiSlice'

export const contentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getContent: builder.query({
      query: ({ courseId, path }) => {
        const encodedPath = encodeURIComponent(path)
        return `/courses/${courseId}/content/${encodedPath}`
      },
      providesTags: (result, error, { courseId, path }) =>
        [{ type: 'Content', id: `${courseId}/${path}` }],
    }),
    getAsset: builder.query({
      query: ({ courseId, path }) => {
        const encodedPath = encodeURIComponent(path)
        return `/courses/${courseId}/assets/${encodedPath}`
      },
    }),
  }),
})

export const {
  useGetContentQuery,
  useGetAssetQuery,
} = contentApi
```

### Component Examples (JavaScript/JSX with Redux)

#### App Component with Redux Provider
```javascript
// main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { store } from './store'
import App from './App'
import './styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
)
```

#### FileTree Component with Redux
```javascript
// components/sidebar/FileTree.jsx
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import { setCurrentPath, toggleNode } from '../../store/slices/courseSlice'
import TreeNode from './TreeNode'

const FileTree = () => {
  const dispatch = useDispatch()
  const { courseStructure, expandedNodes, currentPath } = useSelector(state => state.course)

  const handleNodeClick = (node) => {
    if (node.type === 'file') {
      dispatch(setCurrentPath(node.path))
    } else {
      dispatch(toggleNode(node.path))
    }
  }

  if (!courseStructure) {
    return <div className="file-tree-empty">No course loaded</div>
  }

  return (
    <div className="file-tree">
      <TreeNode
        node={courseStructure}
        onSelect={handleNodeClick}
        expandedNodes={expandedNodes}
        currentPath={currentPath}
      />
    </div>
  )
}

export default FileTree
```

#### ContentViewer Component with RTK Query
```javascript
// components/content/ContentViewer.jsx
import React from 'react'
import { useSelector } from 'react-redux'
import { useGetContentQuery } from '../../services/api/contentApi'
import MarkdownRenderer from './MarkdownRenderer'
import Loading from '../common/Loading'
import ErrorMessage from '../common/ErrorMessage'

const ContentViewer = () => {
  const { currentCourse, currentPath } = useSelector(state => state.course)

  const {
    data: content,
    isLoading,
    isError,
    error
  } = useGetContentQuery(
    {
      courseId: currentCourse?.id,
      path: currentPath
    },
    {
      skip: !currentCourse?.id || !currentPath
    }
  )

  if (!currentPath) {
    return <div className="empty-state">Select a file to view</div>
  }

  if (isLoading) return <Loading />
  if (isError) return <ErrorMessage error={error} />
  if (!content) return null

  return (
    <div className="content-viewer">
      <MarkdownRenderer content={content.content} />
    </div>
  )
}

export default ContentViewer
```

#### Sidebar Component with Redux
```javascript
// components/sidebar/Sidebar.jsx
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useGetCourseStructureQuery } from '../../services/api/courseApi'
import { setCourseStructure } from '../../store/slices/courseSlice'
import FileTree from './FileTree'
import Loading from '../common/Loading'

const Sidebar = ({ courseId }) => {
  const dispatch = useDispatch()
  const { sidebarOpen } = useSelector(state => state.ui)

  const {
    data: structure,
    isLoading,
    isSuccess
  } = useGetCourseStructureQuery(courseId, {
    skip: !courseId
  })

  React.useEffect(() => {
    if (isSuccess && structure) {
      dispatch(setCourseStructure(structure))
    }
  }, [isSuccess, structure, dispatch])

  if (!sidebarOpen) return null

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Course Content</h2>
      </div>
      <div className="sidebar-content">
        {isLoading ? <Loading /> : <FileTree />}
      </div>
    </aside>
  )
}

Sidebar.propTypes = {
  courseId: PropTypes.string
}

export default Sidebar
```

### Custom Hooks (JavaScript with Redux)

```javascript
// hooks/useCourse.js
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useGetCourseQuery } from '../services/api/courseApi'
import { setCurrentCourse } from '../store/slices/courseSlice'

export const useCourse = (courseId) => {
  const dispatch = useDispatch()
  const currentCourse = useSelector(state => state.course.currentCourse)

  const { data: course, isLoading, isSuccess } = useGetCourseQuery(courseId, {
    skip: !courseId
  })

  useEffect(() => {
    if (isSuccess && course) {
      dispatch(setCurrentCourse(course))
    }
  }, [isSuccess, course, dispatch])

  return { course: currentCourse, loading: isLoading }
}
```

```javascript
// hooks/useLocalStorage.js
import { useState, useEffect } from 'react'

export const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Error loading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(`Error saving localStorage key "${key}":`, error)
    }
  }, [key, value])

  return [value, setValue]
}
```

## Data Flow

### Content Loading Flow
```
1. User clicks file in sidebar
   ↓
2. FileTree.onNodeClick(path)
   ↓
3. CourseStore.setCurrentPath(path)
   ↓
4. ContentViewer useEffect triggered
   ↓
5. ContentService.getContent(courseId, path)
   ↓
6. API call: GET /api/v1/courses/{id}/content/{path}
   ↓
7. FastAPI reads file from filesystem
   ↓
8. Content returned and processed
   ↓
9. MarkdownRenderer displays content
```

## Security Considerations

### Path Traversal Protection
```python
def validate_path(base_path: str, requested_path: str) -> bool:
    """Prevent directory traversal attacks"""
    full_path = os.path.abspath(os.path.join(base_path, requested_path))
    return full_path.startswith(os.path.abspath(base_path))
```

### CORS Configuration
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Dev only
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)
```

### Content Security Policy
```python
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["Content-Security-Policy"] = "default-src 'self'"
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    return response
```

## Performance Optimization

### Backend Optimizations
- **Async I/O**: All file operations use aiofiles
- **Connection Pooling**: SQLite with proper connection management
- **Caching**: In-memory cache for frequently accessed content
- **Compression**: Gzip compression for API responses

### Frontend Optimizations
- **Code Splitting**: Dynamic imports for routes
- **Lazy Loading**: Components loaded on demand
- **Memoization**: React.memo for expensive components
- **Virtual Scrolling**: For large file trees
- **Image Optimization**: Lazy loading and responsive images

### Caching Strategy
```javascript
// Frontend cache
const contentCache = new Map()

const getCachedContent = (key) => {
  const cached = contentCache.get(key)
  if (cached && Date.now() - cached.timestamp < 3600000) {
    return cached.content
  }
  return null
}

const setCachedContent = (key, content) => {
  contentCache.set(key, {
    content,
    timestamp: Date.now()
  })
}
```

## Deployment Architecture

### Development Environment
```yaml
# docker-compose.dev.yml
services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    volumes:
      - ./backend:/app
      - ./courses:/courses
    environment:
      - ENV=development

  frontend:
    build: ./frontend
    ports:
      - "5173:5173"
    volumes:
      - ./frontend:/app
    environment:
      - VITE_API_URL=http://localhost:8000
```

### Production Deployment
```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Cloudflare │────▶│   Nginx      │────▶│   FastAPI    │
│     CDN      │     │ Load Balancer│     │   Instances  │
└──────────────┘     └──────────────┘     └──────────────┘
                             │                      │
                             ▼                      ▼
                     ┌──────────────┐     ┌──────────────┐
                     │ React Static │     │   SQLite     │
                     │    Files     │     │   Database   │
                     └──────────────┘     └──────────────┘
```

## Testing Strategy

### Backend Testing
```python
# Unit tests
pytest tests/unit/

# Integration tests
pytest tests/integration/

# Coverage report
pytest --cov=app tests/
```

### Frontend Testing (JavaScript)
```javascript
// Component test example
import { render, screen } from '@testing-library/react'
import FileTree from '../components/sidebar/FileTree'

test('renders file tree', () => {
  const structure = { name: 'root', type: 'folder', children: [] }
  render(<FileTree structure={structure} onSelect={() => {}} />)
  expect(screen.getByText('root')).toBeInTheDocument()
})
```

```bash
# Run tests
npm test

# Coverage
npm run test:coverage
```

## Environment Configuration

### Backend (.env)
```env
# Application
APP_NAME=ELearning Platform
APP_VERSION=1.0.0
DEBUG=false

# Database
DATABASE_URL=sqlite:///./data/elearning.db

# Storage
COURSES_ROOT=/courses
MAX_FILE_SIZE=10485760  # 10MB

# Security
SECRET_KEY=your-secret-key-here
ALLOWED_HOSTS=localhost,127.0.0.1

# CORS
CORS_ORIGINS=http://localhost:5173,https://yourdomain.com
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000
VITE_APP_TITLE=E-Learning Platform
VITE_DEFAULT_COURSE=sample-course
VITE_CACHE_TTL=3600
```

---

*This architecture document provides the technical foundation for building a scalable, maintainable e-learning platform using JavaScript/JSX with React.*