# Task 004: Navigation Integration

## Story
**Story 1.3: Navigate to Course Content**

## Task Description
Connect file tree clicks to content loading with active state highlighting

## Time Estimate
1.5 hours

## Prerequisites
- FileTree component working
- Backend content serving endpoints
- Redux store managing navigation state

## Acceptance Criteria
- [ ] Click on file loads content in main area
- [ ] Currently selected file highlighted in sidebar
- [ ] Loading state shown while content fetches
- [ ] Navigation state persists in Redux
- [ ] Error handling for failed content loads

## Implementation Steps
1. Create content loading Redux actions
2. Add click handler for file selection
3. Implement active state highlighting
4. Add loading states to UI
5. Connect to content API endpoint
6. Add error handling

## Files to Create/Modify
- `frontend/src/store/slices/courseSlice.js`
- `frontend/src/components/TreeNode.jsx`
- `frontend/src/services/contentService.js`
- `frontend/src/components/ContentViewer.jsx`

## Testing
- Test file selection and highlighting
- Verify content loads correctly
- Test loading states
- Test error scenarios (missing files)