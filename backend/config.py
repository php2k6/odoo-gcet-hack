from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    # Database
    DATABASE_URL: str
    
    # Application
    APP_NAME: str = "FastAPI App"
    DEBUG: bool = True
    
    # JWT Settings
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 500
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
