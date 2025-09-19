# Task 010: Folder Browsing Implementation

## Story
**Story 2.3: Browse Folder Contents**

## Task Description
Enable clicking on folders to show their contents as a navigable list

## Time Estimate
1.5 hours

## Prerequisites
- File tree component working
- Content API serving file listings
- Navigation system functional

## Acceptance Criteria
- [ ] Clicking folder shows contents in main area
- [ ] Contents displayed as simple list of files/subfolders
- [ ] Each item in list is clickable to navigate
- [ ] README files displayed by default if present
- [ ] File types and basic info shown
- [ ] Seamless navigation from folder view to files

## Implementation Steps
1. Update backend to serve folder contents
2. Create FolderView component
3. Update navigation to handle folder selection
4. Implement README priority display
5. Add file type indicators
6. Test folder navigation flow

## Files to Create/Modify
- `backend/app/services/content_service.py`
- `frontend/src/components/FolderView.jsx`
- `frontend/src/components/ContentViewer.jsx`
- `frontend/src/store/slices/courseSlice.js`

## Testing
- Test folder selection and content display
- Verify README priority handling
- Test navigation between folders and files
- Test with various folder structures