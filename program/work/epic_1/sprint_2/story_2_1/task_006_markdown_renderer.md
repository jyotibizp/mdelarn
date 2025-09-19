# Task 006: Markdown Renderer Component

## Story
**Story 2.1: Read Markdown Lessons**

## Task Description
Create React component to render markdown content with proper formatting

## Time Estimate
1.5 hours

## Prerequisites
- Content API endpoint working
- react-markdown library installed
- Content viewer component structure

## Acceptance Criteria
- [ ] Markdown renders as formatted HTML
- [ ] Headers, paragraphs, lists display correctly
- [ ] Code blocks in monospace font (NO syntax highlighting)
- [ ] Links are clickable and open in new tabs
- [ ] Content scrollable when longer than viewport
- [ ] Proper typography and spacing

## Implementation Steps
1. Install and configure react-markdown
2. Create MarkdownRenderer component
3. Configure markdown options (no syntax highlighting)
4. Style rendered content with Tailwind
5. Handle external links (target="_blank")
6. Add content scrolling and layout

## Files to Create/Modify
- `frontend/src/components/MarkdownRenderer.jsx`
- `frontend/src/components/ContentViewer.jsx`
- `frontend/src/styles/markdown.css`

## Testing
- Test with various markdown syntax
- Verify code blocks show monospace
- Test link functionality
- Verify responsive content layout