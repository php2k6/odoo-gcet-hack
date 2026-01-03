# FastAPI Auth0 Backend

A FastAPI backend with Auth0 authentication, PostgreSQL database, SQLAlchemy ORM, and Alembic migrations.

## Features

- FastAPI framework
- Auth0 authentication
- PostgreSQL database
- SQLAlchemy ORM
- Alembic migrations
- Pydantic schemas
- Modular router structure

## Project Structure

```
backend/
├── alembic/              # Database migrations
│   ├── versions/         # Migration versions
│   ├── env.py           # Alembic environment
│   └── script.py.mako   # Migration template
├── auth/                 # Authentication
│   └── auth0.py         # Auth0 integration
├── database/            # Database configuration
│   ├── database.py      # Database connection
│   └── models.py        # SQLAlchemy models
├── routers/             # API routes
│   ├── users.py         # User endpoints
│   └── items.py         # Item endpoints
├── schemas/             # Pydantic schemas
│   ├── user.py          # User schemas
│   └── item.py          # Item schemas
├── main.py              # Application entry point
├── config.py            # Configuration settings
├── requirements.txt     # Python dependencies
└── .env                 # Environment variables
```

## Setup

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Configure environment variables:**
   
   Edit `.env` file with your credentials:
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/dbname
   AUTH0_DOMAIN=your-domain.auth0.com
   AUTH0_API_AUDIENCE=your-api-audience
   AUTH0_ISSUER=https://your-domain.auth0.com/
   AUTH0_ALGORITHMS=RS256
   ```

3. **Initialize Alembic (if needed):**
   ```bash
   alembic init alembic
   ```

4. **Create initial migration:**
   ```bash
   alembic revision --autogenerate -m "Initial migration"
   ```

5. **Run migrations:**
   ```bash
   alembic upgrade head
   ```

6. **Run the application:**
   ```bash
   python main.py
   ```
   
   Or with uvicorn:
   ```bash
   uvicorn main:app --reload
   ```

## API Endpoints

### Public
- `GET /` - Root endpoint
- `GET /health` - Health check

### Users (Protected)
- `POST /api/users/` - Create user
- `GET /api/users/` - Get all users
- `GET /api/users/me` - Get current user
- `GET /api/users/{user_id}` - Get user by ID
- `PUT /api/users/{user_id}` - Update user
- `DELETE /api/users/{user_id}` - Delete user

### Items (Protected)
- `POST /api/items/` - Create item
- `GET /api/items/` - Get all items
- `GET /api/items/my-items` - Get current user's items
- `GET /api/items/{item_id}` - Get item by ID
- `PUT /api/items/{item_id}` - Update item
- `DELETE /api/items/{item_id}` - Delete item

## Auth0 Setup

1. Create an Auth0 account at https://auth0.com
2. Create a new API in your Auth0 dashboard
3. Set the identifier as your `AUTH0_API_AUDIENCE`
4. Copy your domain to `AUTH0_DOMAIN`
5. Use RS256 algorithm

## Authentication

All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your-auth0-token>
```

## Database Migrations

Create a new migration:
```bash
alembic revision --autogenerate -m "Description of changes"
```

Apply migrations:
```bash
alembic upgrade head
```

Rollback migration:
```bash
alembic downgrade -1
```

## Development

The application runs with auto-reload enabled in development mode. Access the API documentation at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
