from sqlalchemy import Column, Integer, String, Text, Date, TIMESTAMP, ForeignKey
from database import Base

class ResearchPaper(Base):
    __tablename__ = "research_paper"
    __table_args__ = {"schema": "CMS"}

    paper_id = Column(Integer, primary_key=True, autoincrement=True, nullable=False)
    title = Column(String, nullable=False)
    abstract = Column(Text, nullable=True)
    authors = Column(String, nullable=True)  # Comma-separated names
    publication_date = Column(Date, nullable=True)
    doi = Column(String, nullable=True)
    status = Column(String, nullable=True)  # e.g., Published, Draft, etc.
    created_at = Column(TIMESTAMP, nullable=True)
    updated_at = Column(TIMESTAMP, nullable=True)
    user_id = Column(Integer, ForeignKey("CMS.users.user_id"), nullable=False)