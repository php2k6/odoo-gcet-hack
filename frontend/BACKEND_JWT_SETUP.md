# Backend JWT Authentication with Google

Your backend needs to implement this endpoint to verify Google ID tokens and issue your own JWT tokens.

## Required Backend Endpoint

### POST `/api/auth/google`

**Request Body:**
```json
{
  "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjE4MmU..." // Google ID Token (JWT)
}
```

**Response:**
```json
{
  "token": "your-backend-jwt-token",
  "user": {
    "name": "John Doe",
    "email": "john@example.com",
    "picture": "https://lh3.googleusercontent.com/..."
  }
}
```

## Backend Implementation Examples

### Node.js + Express Example

```javascript
const express = require('express');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post('/auth/google', async (req, res) => {
  try {
    const { idToken } = req.body;

    // Verify the Google ID token
    const ticket = await client.verifyIdToken({
      idToken: idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const googleId = payload['sub'];
    const email = payload['email'];
    const name = payload['name'];
    const picture = payload['picture'];

    // Find or create user in your database
    // let user = await User.findOrCreate({ googleId, email, name, picture });

    // Generate your own JWT token
    const token = jwt.sign(
      {
        userId: googleId,
        email: email,
        name: name
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        name,
        email,
        picture
      }
    });

  } catch (error) {
    console.error('Error verifying Google token:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
});

module.exports = router;
```

### Python + Flask Example

```python
from flask import Flask, request, jsonify
from google.oauth2 import id_token
from google.auth.transport import requests
import jwt
import datetime
import os

app = Flask(__name__)

@app.route('/api/auth/google', methods=['POST'])
def google_auth():
    try:
        token = request.json.get('idToken')
        
        # Verify the Google ID token
        idinfo = id_token.verify_oauth2_token(
            token, 
            requests.Request(), 
            os.environ['GOOGLE_CLIENT_ID']
        )
        
        # Get user info from the token
        google_id = idinfo['sub']
        email = idinfo['email']
        name = idinfo['name']
        picture = idinfo.get('picture', '')
        
        # Find or create user in your database
        # user = User.find_or_create(google_id=google_id, email=email, name=name)
        
        # Generate your own JWT token
        payload = {
            'userId': google_id,
            'email': email,
            'name': name,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7)
        }
        
        jwt_token = jwt.encode(
            payload, 
            os.environ['JWT_SECRET'], 
            algorithm='HS256'
        )
        
        return jsonify({
            'token': jwt_token,
            'user': {
                'name': name,
                'email': email,
                'picture': picture
            }
        })
        
    except ValueError as e:
        return jsonify({'message': 'Invalid token'}), 401
```

## Required Environment Variables

Backend needs these environment variables:

```bash
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
JWT_SECRET=your-secret-key-for-signing-jwts
```

## Required Backend Packages

**Node.js:**
```bash
npm install express jsonwebtoken google-auth-library
```

**Python:**
```bash
pip install flask pyjwt google-auth
```

## Testing the Endpoint

Use curl or Postman to test:

```bash
curl -X POST http://localhost:3000/api/auth/google \
  -H "Content-Type: application/json" \
  -d '{"idToken": "your-google-id-token-here"}'
```

## Protected Routes

For protected API routes, verify the JWT token:

```javascript
// Node.js middleware
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Use in routes
app.get('/api/protected', verifyToken, (req, res) => {
  res.json({ message: 'This is protected', user: req.user });
});
```
