from sqlalchemy import Column, Integer, String, Text, Date, Numeric, TIMESTAMP, func, ForeignKey
from database import Base

class Startup(Base):
    __tablename__ = "startups"

    startup_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    founder = Column(String(255))
    industry = Column(String(100))
    founded_date = Column(Date)
    status = Column(String(50))
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
    updated_at = Column(TIMESTAMP(timezone=True), onupdate=func.now())
    user_id = Column(Numeric, ForeignKey("users.id"))
