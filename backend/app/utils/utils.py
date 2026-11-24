import os
from typing import List, Union
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

# Locate .env in backend directory
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
ENV_PATH = os.path.join(BASE_DIR, ".env")


class Settings(BaseSettings):
    SECRET_KEY: str = "balavignesh-ai-portfolio-jwt-secret-key-2026-production-grade"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 10080
    ADMIN_EMAIL: str = "admin@balavignesh.dev"
    ADMIN_PASSWORD: str = "Balavignesh@2026"
    DATABASE_URL: str = "sqlite+aiosqlite:///./portfolio.db"
    CORS_ORIGINS: Union[List[str], str] = ["*"]
    UPLOAD_DIR: str = os.path.join(BASE_DIR, "uploads")

    model_config = SettingsConfigDict(
        env_file=ENV_PATH if os.path.exists(ENV_PATH) else ".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    @field_validator("UPLOAD_DIR", mode="after")
    @classmethod
    def resolve_upload_dir(cls, v):
        if isinstance(v, str) and not os.path.isabs(v):
            return os.path.join(BASE_DIR, v)
        return v

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def parse_cors(cls, v):
        if isinstance(v, str):
            if v == "*":
                return ["*"]
            return [origin.strip() for origin in v.split(",") if origin.strip()]
        return v


settings = Settings()
