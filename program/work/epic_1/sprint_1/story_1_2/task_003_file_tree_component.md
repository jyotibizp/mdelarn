# Task 003: File Tree Component

## Story
**Story 1.2: Expand/Collapse Course Modules**

## Task Description
Create expandable/collapsible file tree component with folder and file icons

## Time Estimate
2 hours

## Prerequisites
- React app running
- Redux store configured
- Course structure API endpoint working

## Acceptance Criteria
- [ ] File tree renders course structure
- [ ] Folders show expand/collapse icons (▶/▼)
- [ ] Click on folder toggles expand/collapse
- [ ] Files and folders have different icons (📁/📄)
- [ ] Tree structure matches course directory layout
- [ ] Smooth expand/collapse animation

## Implementation Steps
1. Create FileTree component
2. Create TreeNode recursive component
3. Add expand/collapse state management in Redux
4. Implement folder/file icon system
5. Add click handlers for expand/collapse
6. Style with Tailwind CSS
7. Add smooth animations

## Files to Create/Modify
- `frontend/src/components/FileTree.jsx`
- `frontend/src/components/TreeNode.jsx`
- `frontend/src/store/slices/courseSlice.js`
- `frontend/src/hooks/useCourse.js`

## Testing
- Test with various course structures
- Verify expand/collapse works at all levels
- Test performance with large course structures
- Verify animations are smooth