# E-Learning Platform MVP

A simple, functional e-learning platform for displaying course content with basic navigation and markdown rendering.

## Features ✅

- **File Tree Navigation**: Browse course content through an expandable folder structure
- **Markdown Rendering**: Display markdown files with proper formatting
- **Image Support**: Display images inline with content
- **Multiple File Types**: Support for .md, .txt, .json, and other common formats
- **Responsive Design**: Works on desktop and mobile devices
- **Clean UI**: Simple, distraction-free interface

## Quick Start

1. **Install Dependencies**:
   ```bash
   cd backend
   npm install
   ```

2. **Start the Platform**:
   ```bash
   # From project root
   ./start.sh
   ```
   Or manually:
   ```bash
   cd backend
   npm start
   ```

3. **Open in Browser**:
   Visit [http://localhost:3000](http://localhost:3000)

## Project Structure

```
mdelarn/
├── frontend/           # Frontend application
│   ├── index.html      # Main HTML structure
│   ├── style.css       # Styling and layout
│   └── app.js          # JavaScript application logic
├── backend/            # Simple Node.js API server
│   ├── server.js       # Express server
│   └── package.json    # Dependencies
├── courses/            # Course content directory
│   └── sample-course/  # Example course
└── start.sh           # Quick start script
```

## Course Content Structure

The platform supports the following course structure:

```
courses/
└── your-course-name/
    ├── README.md              # Course overview
    ├── 0-introduction/        # Module folders (numbered)
    │   └── welcome.md
    ├── 1-fundamentals/
    │   ├── lessons/
    │   │   ├── lesson-01.md
    │   │   └── lesson-02.md
    │   └── exercises/
    │       └── exercise-01.md
    └── resources/             # Additional resources
```

### Supported File Types

- **`.md`, `.markdown`**: Rendered as formatted markdown
- **`.txt`**: Displayed as plain text
- **`.json`**: Pretty-printed JSON
- **`.js`, `.py`, `.html`, `.css`**: Displayed as code
- **`.jpg`, `.png`, `.gif`**: Displayed as images
- **`.pdf`**: Available for download

## Usage

1. **Navigation**: Click folders in the sidebar to expand/collapse them
2. **Content Viewing**: Click files to display their content
3. **README Files**: Automatically loaded when expanding folders
4. **External Links**: Open in new tabs for external resources

## Technology Stack

- **Frontend**: Vanilla HTML, CSS, JavaScript
- **Markdown Parser**: Marked.js (CDN)
- **Backend**: Node.js + Express
- **File Serving**: Static file serving with API endpoints

## API Endpoints

- `GET /api/course-structure` - Returns the course folder structure
- `GET /api/content/<file-path>` - Returns the content of a specific file
- Static file serving for direct course content access

## Development

### Adding New Courses

1. Create a new folder in the `courses/` directory
2. Add your content files (markdown, images, etc.)
3. Restart the server to refresh the course structure
4. The new course will appear in the navigation

### Customizing the UI

- Edit `frontend/style.css` for styling changes
- Modify `frontend/app.js` for functionality changes
- Update `frontend/index.html` for structural changes

### Extending Features

The current MVP provides a solid foundation. Consider these enhancements:

- **Search functionality** within course content
- **Progress tracking** for learners
- **Code syntax highlighting** for better code display
- **Video content support** for multimedia courses
- **User accounts** for personalized learning

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Performance

- Lightweight design with minimal dependencies
- Content loads on-demand for fast navigation
- Responsive design for various screen sizes

## Security

- Path traversal protection for file access
- CORS enabled for development
- Static file serving with controlled access

---

**MVP Status**: ✅ Complete - Ready for basic course content delivery

For issues or feature requests, check the project documentation or create an issue.