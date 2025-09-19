# Task 013: Current Location Tracking

## Story
**Story 3.2: Identify Current Location**

## Task Description
Implement clear visual indicators for current location and navigation state

## Time Estimate
1.5 hours

## Prerequisites
- File tree navigation working
- Content viewer functional
- Navigation state management in Redux

## Acceptance Criteria
- [ ] Currently selected file highlighted in sidebar
- [ ] Content area shows filename/title at top
- [ ] Visual indicators clearly show current position
- [ ] Highlighting persists during navigation
- [ ] Current selection easily distinguishable
- [ ] Breadcrumb-style navigation (optional)

## Implementation Steps
1. Update Redux state to track current location
2. Add visual highlighting to selected items
3. Display current file info in content area
4. Implement persistent highlighting
5. Add breadcrumb navigation (if time allows)
6. Test location tracking accuracy

## Files to Create/Modify
- `frontend/src/store/slices/courseSlice.js`
- `frontend/src/components/TreeNode.jsx`
- `frontend/src/components/ContentViewer.jsx`
- `frontend/src/components/Breadcrumb.jsx`

## Testing
- Test current location accuracy
- Verify highlighting persistence
- Test with various navigation patterns
- Check visual clarity of current location