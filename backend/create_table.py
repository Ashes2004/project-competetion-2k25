# create_tables.py
from database import Base, engine
from models.users import User
from models.startup import Startup
from models.IPR import IPR
from models.research import ResearchPaper


Base.metadata.create_all(bind=engine)
print("✅ Tables created!")
