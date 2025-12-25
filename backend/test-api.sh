#!/bin/bash

# Simple script to test the ResumeLint API endpoints
# Make sure the server is running on localhost:3000

BASE_URL="http://localhost:3000"

echo "=========================================="
echo "ResumeLint API Test Script"
echo "=========================================="
echo ""

# Test 1: Health Check
echo "1. Testing health check..."
curl -s "$BASE_URL/health" | jq '.' || echo "Failed"
echo ""
echo ""

# Test 2: Login
echo "2. Testing login..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "email",
    "email": "john.doe@example.com",
    "password": "test"
  }')

echo "$LOGIN_RESPONSE" | jq '.'
ACCESS_TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.accessToken')
echo ""
echo "Access Token: $ACCESS_TOKEN"
echo ""
echo ""

# Test 3: Get User Profile
echo "3. Testing get user profile..."
curl -s "$BASE_URL/api/users/me" \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq '.'
echo ""
echo ""

# Test 4: Get Usage
echo "4. Testing get usage..."
curl -s "$BASE_URL/api/usage" \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq '.'
echo ""
echo ""

# Test 5: Create Resume
echo "5. Testing create resume (text)..."
RESUME_RESPONSE=$(curl -s -X POST "$BASE_URL/api/resumes" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "John Doe\nSoftware Engineer\n\nExperience:\n- Senior Engineer at TechCorp\n- Built microservices\n\nSkills: Node.js, TypeScript, Docker",
    "role": "Backend Engineer"
  }')

echo "$RESUME_RESPONSE" | jq '.'
RESUME_ID=$(echo "$RESUME_RESPONSE" | jq -r '.id')
echo ""
echo "Resume ID: $RESUME_ID"
echo ""
echo ""

# Test 6: List Resumes
echo "6. Testing list resumes..."
curl -s "$BASE_URL/api/resumes" \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq '.'
echo ""
echo ""

# Test 7: Analyze Resume
echo "7. Testing analyze resume..."
curl -s -X POST "$BASE_URL/api/resumes/$RESUME_ID/analyze" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" | jq '.'
echo ""
echo ""

# Test 8: Create Job Description and Match
echo "8. Testing job description and match..."
JD_RESPONSE=$(curl -s -X POST "$BASE_URL/api/job-descriptions" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "rawText": "We are looking for a Backend Engineer with experience in Node.js, Docker, Kubernetes, and GraphQL.",
    "title": "Senior Backend Engineer",
    "company": "Tech Company"
  }')

echo "$JD_RESPONSE" | jq '.'
JD_ID=$(echo "$JD_RESPONSE" | jq -r '.id')
echo ""
echo ""

echo "9. Testing match resume to job description..."
curl -s -X POST "$BASE_URL/api/resumes/$RESUME_ID/match" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"jobDescriptionId\": \"$JD_ID\"
  }" | jq '.'
echo ""
echo ""

# Test 10: Get matches
echo "10. Testing get matches..."
curl -s "$BASE_URL/api/resumes/$RESUME_ID/matches" \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq '.'
echo ""
echo ""

echo "=========================================="
echo "API Tests Complete!"
echo "=========================================="
