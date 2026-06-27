"""
SWARMNET Backend — Application Core Configuration
===================================================
Centralized configuration using Pydantic Settings.
All environment variables are validated and typed here.
"""

from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """
    Application settings loaded from environment variables.
    Uses .env file as fallback for local development.
    """

    # ─── Application ───
    app_name: str = "SWARMNET"
    app_version: str = "0.1.0"
    environment: str = "development"
    debug: bool = True
    secret_key: str = "dev-secret-key-change-in-production"
    access_token_expire_minutes: int = 60 * 24 * 7 # 7 days

    # ─── Database ───
    database_url: str = "sqlite+aiosqlite:///./swarmnet.db"
    db_echo: bool = False

    # ─── Redis ───
    redis_url: str = "redis://localhost:6379/0"

    # ─── CORS ───
    allowed_origins: str = "http://localhost:3000"

    @property
    def cors_origins(self) -> list[str]:
        """Parse comma-separated CORS origins into a list."""
        return [origin.strip() for origin in self.allowed_origins.split(",")]

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False


@lru_cache()
def get_settings() -> Settings:
    """
    Cached settings instance — created once and reused.
    Call this function to access settings anywhere in the app.
    """
    return Settings()
