from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from config import SQLALCHEMY_DATABASE_URL

# Database Setup
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Supabase Setup
from supabase import create_client
from config import SUPABASE_URL, SUPABASE_KEY

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    