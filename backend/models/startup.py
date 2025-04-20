from sqlalchemy import Column, Integer, String, Text, Date, TIMESTAMP, ForeignKey
from database import Base

class Startup(Base):
    __tablename__ = "startup"
    __table_args__ = {"schema": "CMS"}

    startup_id = Column(Integer, primary_key=True, autoincrement=True, nullable=False)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    founder = Column(String, nullable=True)
    industry = Column(String, nullable=True)
    founded_date = Column(Date, nullable=True)
    status = Column(String, nullable=True)
    created_at = Column(TIMESTAMP, nullable=True)
    updated_at = Column(TIMESTAMP, nullable=True)
    user_id = Column(Integer, ForeignKey("CMS.users.user_id"), nullable=True)
