# Task 011: Content Type Organization

## Story
**Story 5.1: Access Different Content Types**

## Task Description
Implement clear organization and labeling of different content types (lessons, exercises, solutions)

## Time Estimate
1 hour

## Prerequisites
- File tree navigation working
- Content rendering functional
- Course structure API complete

## Acceptance Criteria
- [ ] Different content types clearly labeled
- [ ] Easy navigation to lessons, exercises, solutions
- [ ] Related content relationships obvious
- [ ] Module numbering (0-intro, 1-fundamentals) clear
- [ ] Intuitive workflow from lesson → exercise → solution

## Implementation Steps
1. Add content type detection logic
2. Implement visual indicators for content types
3. Update file tree to show content relationships
4. Add module numbering display
5. Test with sample course structure

## Files to Create/Modify
- `frontend/src/utils/contentTypes.js`
- `frontend/src/components/TreeNode.jsx`
- `frontend/src/components/ContentViewer.jsx`

## Testing
- Test with various content structures
- Verify content type detection accuracy
- Test content relationship navigation
- Verify module numbering display