from sqlalchemy import Column, String, Text,Integer
from database import Base

class User(Base):
    __tablename__ = "users"
    __table_args__ = {"schema": "CMS"}

    user_id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)
    email = Column(Text, nullable=True)
    role = Column(String, nullable=True)
