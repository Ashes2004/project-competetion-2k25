# RIISE: Research, IPR, Innovation, and Start-up Ecosystem Platform

## 📑 Overview

RIISE is a comprehensive web-based platform designed to unify the processes involved in research management, intellectual property rights (IPR), innovation tracking, and start-up ecosystem support. By streamlining these functions into a single, accessible digital platform, RIISE enhances collaboration, improves decision-making, ensures transparency, and fosters a more efficient and supportive ecosystem for innovation and entrepreneurship.

## 🎯 Problem Statement

Current systems for managing research, IPR, innovation, and start-up ecosystems face several significant challenges:

1. Information fragmentation across institutions and departments
2. Redundant funding and overlapping research efforts
3. Slow and inefficient project approvals and monitoring processes
4. Non-transparent and time-consuming IPR processes
5. Difficulty for start-ups to access timely support, funding, mentorship, and networking opportunities

Our platform addresses these limitations by integrating all these aspects under a single unified system.

## ✨ Key Features

- **User Management**: Role-based access control with authentication system
- **Research Management Module**: Project registration, funding monitoring, and team collaboration tools
- **IPR Management Module**: Patent application tracking, IP portfolio management, and automated notifications
- **Innovation Tracking Module**: Innovation registration and progress monitoring with research-IP linkage
- **Start-up Ecosystem Module**: Start-up profiles, incubation program tracking, and performance metrics
- **Session Management**: Secure login/logout with unauthorized access prevention

## 🛠️ Technology Stack

### Frontend
- **React.js**: Component-based dynamic UI
- **Tailwind CSS**: Utility-first modern styling
- **React Router**: Navigation across dashboard views
- **React-lucide**: Scalable icon system
- **Framer Motion**: Animations and transition effects

### Backend
- **Flask**: Python web framework for backend APIs
- **Flask-JWT-Extended**: JWT-based authentication & role-based access
- **Flask-CORS**: Enables secure frontend-backend communication
- **Flask-Mail**: For sending email notifications
- **SQLAlchemy**: ORM to interact with relational databases

### Database
- **PostgreSQL**: Relational database for structured data

### Deployment
- **Vercel**: Deploy the React frontend
- **Koyeb**: Host Flask backend
- **Supabase**: Online SQLite database hosting

## 📊 System Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│                 │     │                  │     │                 │
│    Frontend     │     │     Backend      │     │    Database     │
│    (React.js)   │────▶│     (Flask)      │────▶│  (PostgreSQL)  │
│                 │     │                  │     │                 │
└─────────────────┘     └──────────────────┘     └─────────────────┘
        │                       │                        │
        │                       │                        │
        ▼                       ▼                        ▼
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  User Interface │     │  Business Logic  │     │  Data Storage   │
│  - Dashboard    │     │  - APIs          │     │  - ProfileDB    │
│  - Forms        │     │  - Authentication│     │  - ResearchDB   │
│  - Reports      │     │  - Processing    │     │  - StartupDB    │
│                 │     │                  │     │  - InnovationDB │
└─────────────────┘     └──────────────────┘     │  - IPRDB        │
                                                 └─────────────────┘
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16+)
- Python (v3.8+)
- Git

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/riise.git
   cd riise
   ```

2. Set up the frontend
   ```bash
   cd frontend
   npm install
   ```

3. Set up the backend
   ```bash
   cd ../backend
   pip install -r requirements.txt
   ```

4. Configure environment variables
   ```bash
   cp .env.example .env
   # Edit .env with your configurations
   ```

5. Run the development servers
   ```bash
   # In frontend directory
   npm run dev
   
   # In backend directory
   flask run
   ```


## 📝 Development Workflow

1. **Requirement Analysis and System Design** (Weeks 1-2)
   - System architecture design
   - Database schema development
   - UI/UX prototyping with user journey mapping

2. **Core Infrastructure Development** (Weeks 3-4)
   - Development environment setup with CI/CD pipeline
   - Database implementation
   - Authentication system with role-based access control

3. **Module Development** (Weeks 5-10)
   - Implementation of five core modules
   - User Profile Module with ProfileDB integration
   - Research Management with ResearchDB connection
   - Start-up Management linked to StartupDB
   - Innovation Management with InnovationDB
   - IPR Management connected to IPRDB

4. **Integration and System Testing** (Weeks 11-12)
   - End-to-end integration testing across modules
   - Performance and security testing
   - User acceptance testing with key stakeholders

5. **Deployment and Documentation** (Weeks 13-14)
   - System deployment in staging environment
   - Database migration
   - User manual creation
   - Technical documentation

## 💻 Non-Functional Requirements

- **Performance**: Response time < 3 seconds
- **Scalability**: Support for 10,000+ concurrent users
- **Security**: Data encryption, IT Act compliance
- **Reliability**: 99.9% uptime with data backup
- **Usability**: Intuitive desktop-optimized UI
- **Interoperability**: Standard API interfaces

## 👥 Team

- **Ashes Das**
- **Atul Kumar Singh**
- **Aniket Ghosh**
- **Ankur Goswami**
- **Arindam Das**
- **Kumari Pragya**

## 📚 References

For a complete list of references, please see the full project documentation.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

*RIISE - Unifying Research, Innovation, IPR, and Start-up Management*
