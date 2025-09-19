# Task 001: FastAPI Project Setup

## Story
**Story 1.1: View Course Structure**

## Task Description
Set up basic FastAPI project structure with course directory scanning capability

## Time Estimate
1.5 hours

## Prerequisites
- Backend directory structure created
- Python virtual environment set up
- FastAPI installed

## Acceptance Criteria
- [ ] FastAPI app runs on localhost:8000
- [ ] Basic course model created
- [ ] Course directory scanning function works
- [ ] API endpoint returns course structure JSON
- [ ] CORS enabled for frontend connection

## Implementation Steps
1. Create FastAPI main.py with basic app setup
2. Create course model and schema
3. Implement directory scanning service
4. Create GET /courses/{course_id}/structure endpoint
5. Test with sample course directory
6. Add CORS middleware for React app

## Files to Create/Modify
- `backend/app/main.py`
- `backend/app/models/course.py`
- `backend/app/services/course_service.py`
- `backend/app/api/routes/courses.py`

## Testing
- Test API endpoint with curl/Postman
- Verify JSON structure matches frontend needs
- Test with different course directory structures