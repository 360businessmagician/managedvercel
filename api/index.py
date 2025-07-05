from fastapi import FastAPI, HTTPException, status, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from datetime import datetime, timedelta
import os
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from passlib.context import CryptContext
import jwt
import uuid

# DeafAuth Schemas
class DeafUserCreate(BaseModel):
    """Schema for deaf user registration in DeafAuth system"""
    username: str
    email: EmailStr
    password: str
    preferred_sign_language: Optional[str] = "ASL"  # ASL, BSL, ISL, etc.
    accessibility_preferences: Optional[dict] = {}
    deaf_community_verification: Optional[bool] = False

class DeafUserLogin(BaseModel):
    """Schema for deaf user sign-in"""
    email: EmailStr
    password: str

class DeafUserProfile(BaseModel):
    """Schema for deaf user profile"""
    id: str
    username: str
    email: EmailStr
    preferred_sign_language: str
    accessibility_preferences: dict
    deaf_community_verified: bool
    created_at: str
    last_login: Optional[str] = None

class DeafAuthToken(BaseModel):
    """Schema for DeafAuth JWT token"""
    access_token: str
    token_type: str = "bearer"
    user_profile: DeafUserProfile

class MessageResponse(BaseModel):
    message: str

# DeafAuth Utils
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = os.getenv("DEAFAUTH_JWT_SECRET", os.getenv("JWT_SECRET_KEY", "deaf-auth-secret-key"))
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 120  # Extended for accessibility

security = HTTPBearer()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_deaf_auth_token(user_data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Creates a DeafAuth-specific JWT token"""
    to_encode = user_data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({
        "exp": expire,
        "iat": datetime.utcnow(),
        "iss": "deafauth.mbtq.dev",
        "aud": "mbtq-ecosystem",
        "auth_type": "deaf_community"
    })
    
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def decode_deaf_auth_token(token: str) -> Optional[dict]:
    """Decodes a DeafAuth JWT token"""
    try:
        decoded_token = jwt.decode(
            token, 
            SECRET_KEY, 
            algorithms=[ALGORITHM],
            audience="mbtq-ecosystem",
            issuer="deafauth.mbtq.dev"
        )
        return decoded_token
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

# In-memory DeafAuth database
deaf_users_db = {}

def get_deaf_user_by_email(email: str) -> Optional[DeafUserProfile]:
    for user_id, user in deaf_users_db.items():
        if user.email == email:
            return user
    return None

def create_deaf_user(user: DeafUserProfile) -> DeafUserProfile:
    user.id = str(uuid.uuid4())
    deaf_users_db[user.id] = user
    return user

def update_deaf_user_last_login(user_id: str):
    if user_id in deaf_users_db:
        deaf_users_db[user_id].last_login = datetime.utcnow().isoformat()

async def get_current_deaf_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> DeafUserProfile:
    """Dependency to get current authenticated deaf user"""
    token_data = decode_deaf_auth_token(credentials.credentials)
    if not token_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired DeafAuth token"
        )
    
    user = get_deaf_user_by_email(token_data.get("sub"))
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found in DeafAuth system"
        )
    
    return user

# DeafAuth FastAPI app
app = FastAPI(
    title="DeafAuth - Identity Verification for Deaf Community",
    description="Authentication and identity verification system specifically designed for the deaf community within the MBTQ ecosystem",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware for deaf-friendly applications
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://mbtq.dev",
        "https://www.mbtq.dev",
        "https://admin.mbtquniverse.com",
        "https://deafauth.mbtq.dev",
        "http://localhost:3000",
        "http://localhost:8080"
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "service": "DeafAuth",
        "description": "Identity verification and authentication for the deaf community",
        "status": "active",
        "version": "1.0.0",
        "ecosystem": "MBTQ Universe",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    return {
        "service": "DeafAuth",
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "deaf_community_ready": True
    }

@app.post("/auth/register", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
async def register_deaf_user(user_data: DeafUserCreate):
    """
    Register a new user in the DeafAuth system.
    Designed specifically for deaf community members with accessibility preferences.
    """
    existing_user = get_deaf_user_by_email(user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered in DeafAuth system"
        )

    if len(user_data.username) < 3:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username must be at least 3 characters long"
        )

    # Default accessibility preferences for deaf users
    default_accessibility = {
        "visual_notifications": True,
        "vibration_alerts": True,
        "high_contrast_mode": False,
        "sign_language_video_quality": "high",
        "captions_enabled": True,
        "gesture_navigation": True
    }
    
    accessibility_prefs = {**default_accessibility, **(user_data.accessibility_preferences or {})}

    hashed_password = get_password_hash(user_data.password)
    new_user = DeafUserProfile(
        id="",
        username=user_data.username,
        email=user_data.email,
        preferred_sign_language=user_data.preferred_sign_language or "ASL",
        accessibility_preferences=accessibility_prefs,
        deaf_community_verified=user_data.deaf_community_verification or False,
        created_at=datetime.utcnow().isoformat()
    )
    
    # Store hashed password separately (not in profile)
    new_user_with_password = type('DeafUserInDB', (), {
        **new_user.dict(),
        'hashed_password': hashed_password
    })()
    
    create_deaf_user(new_user_with_password)
    
    return {
        "message": f"DeafAuth account created successfully for {user_data.username}. Welcome to the deaf-friendly MBTQ ecosystem!"
    }

@app.post("/auth/signin", response_model=DeafAuthToken)
async def deaf_user_signin(user_data: DeafUserLogin):
    """
    Sign in to DeafAuth system.
    Returns a JWT token with deaf community-specific claims and accessibility preferences.
    """
    user = get_deaf_user_by_email(user_data.email)
    if not user or not verify_password(user_data.password, getattr(user, 'hashed_password', '')):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password for DeafAuth system",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_deaf_auth_token(
        data={
            "sub": user.email,
            "user_id": user.id,
            "username": user.username,
            "preferred_sign_language": user.preferred_sign_language,
            "deaf_community_verified": user.deaf_community_verified,
            "accessibility_preferences": user.accessibility_preferences,
            "auth_system": "DeafAuth"
        },
        expires_delta=access_token_expires
    )
    
    update_deaf_user_last_login(user.id)
    
    # Return token with user profile for immediate use
    user_profile = DeafUserProfile(
        id=user.id,
        username=user.username,
        email=user.email,
        preferred_sign_language=user.preferred_sign_language,
        accessibility_preferences=user.accessibility_preferences,
        deaf_community_verified=user.deaf_community_verified,
        created_at=user.created_at,
        last_login=user.last_login
    )
    
    return DeafAuthToken(
        access_token=access_token,
        token_type="bearer",
        user_profile=user_profile
    )

@app.get("/auth/profile", response_model=DeafUserProfile)
async def get_deaf_user_profile(current_user: DeafUserProfile = Depends(get_current_deaf_user)):
    """
    Get the current deaf user's profile with accessibility preferences.
    Requires valid DeafAuth token.
    """
    return current_user

@app.put("/auth/accessibility-preferences")
async def update_accessibility_preferences(
    preferences: dict,
    current_user: DeafUserProfile = Depends(get_current_deaf_user)
):
    """
    Update accessibility preferences for the deaf user.
    """
    if current_user.id in deaf_users_db:
        deaf_users_db[current_user.id].accessibility_preferences.update(preferences)
        return {"message": "Accessibility preferences updated successfully"}
    
    raise HTTPException(status_code=404, detail="User not found")

# Legacy endpoint for compatibility
@app.post("/auth/login", response_model=DeafAuthToken)
async def login_compatibility(user_data: DeafUserLogin):
    """Legacy login endpoint - redirects to signin"""
    return await deaf_user_signin(user_data)

# Export for Vercel
handler = app
