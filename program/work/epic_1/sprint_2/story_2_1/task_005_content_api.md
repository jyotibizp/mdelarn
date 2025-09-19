# Task 005: Content API Implementation

## Story
**Story 2.1: Read Markdown Lessons**

## Task Description
Create backend API endpoints for serving file content with markdown parsing

## Time Estimate
1.5 hours

## Prerequisites
- FastAPI app running
- File system service created
- Course structure API working

## Acceptance Criteria
- [ ] GET /courses/{course_id}/content/{path} endpoint
- [ ] Markdown files parsed to HTML
- [ ] Text files served as plain text
- [ ] Proper MIME type handling
- [ ] File not found error handling
- [ ] Content metadata included in response

## Implementation Steps
1. Create content service with file reading
2. Integrate markdown parser (python-markdown)
3. Create content API endpoints
4. Add file type detection
5. Implement error handling
6. Add content caching (basic)

## Files to Create/Modify
- `backend/app/services/content_service.py`
- `backend/app/api/routes/content.py`
- `backend/app/schemas/content.py`
- `backend/app/main.py` (add content routes)

## Testing
- Test markdown parsing with various syntax
- Test with different file types
- Verify error handling for missing files
- Test content metadata response