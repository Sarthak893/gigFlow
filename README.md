# GigFlow – Full Stack Freelance Marketplace

GigFlow is a **mini freelance marketplace platform** where users can post jobs (Gigs) and freelancers can bid on them. The platform focuses on **clean backend logic, secure authentication, and real-world hiring workflows**, built as part of a Full Stack Development Internship assignment.

---

## Live Demo

* **Frontend (Vercel):** [https://gig-flow-ebon.vercel.app](https://gig-flow-ebon.vercel.app)
* **Backend (Render):** [https://gigflow-0eql.onrender.com](https://gigflow-0eql.onrender.com)

---

##  Project Overview

GigFlow allows:

* Any user to act as a **Client** (post gigs)
* Any user to act as a **Freelancer** (place bids)

There are **no fixed roles** — the system is flexible and mirrors real-world freelance platforms.

The project demonstrates:

* Secure JWT-based authentication
* Complex relational data handling (Users, Gigs, Bids)
* Hiring logic with bid state transitions
* Production deployment on Vercel & Render

---

##  Features Overview

###  Authentication

* User **Register & Login**
* JWT-based authentication (Bearer Token)
* Protected routes using middleware
* Persistent login using `localStorage`

---

###  Gig Management

* Create a new Gig (Title, Description, Budget)
* View all **open gigs** on the homepage
* Search gigs by title or description
* View gig details page
* Gig status management: `open → assigned`

---

###  Bidding System

* Freelancers can place bids on gigs
* Bid includes:

  * Proposed price
  * Message
* Gig owner can view all bids for their gig

---

###  Hiring Logic (Core Feature)

* Client can **hire one freelancer** for a gig
* When hired:

  * Gig status changes to `assigned`
  * Selected bid → `hired`
  * All other bids → `rejected`

> Ensures correct business logic and prevents multiple hires for the same gig.

---

###  Dashboards

* **Client Dashboard**

  * View own posted gigs
  * View bids received
  * Hire freelancers

* **Freelancer Dashboard**

  * View bids placed
  * Track bid status (`pending / hired / rejected`)

---

##  Tech Stack

### Frontend

* React.js (Vite)
* Tailwind CSS
* React Router
* Context API (Auth State Management)

### Backend

* Node.js
* Express.js
* MongoDB + Mongoose
* JWT Authentication (Bearer Tokens)

### Deployment

* Frontend: **Vercel**
* Backend: **Render**
* Database: **MongoDB Atlas**

---

##  Authentication Design (Important Note)

Originally, the project used **HttpOnly cookies**. During production deployment (Vercel + Render), cross-domain cookie limitations caused authentication issues.

➡️ The system was refactored to use **JWT Bearer Tokens** via the `Authorization` header.

**Why this approach was chosen:**

* Works reliably across domains
* Avoids third-party cookie restrictions
* Common industry practice for SPAs
* Simplifies deployment and testing

---

## ⚙️ Local Setup Instructions

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Sarthak893/gigFlow.git
cd gigFlow
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Run backend:

```bash
npm run dev
```

Backend will start at:

```
http://localhost:5000
```

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` folder:

```env
VITE_API_BASE=http://localhost:5000/api
```

Run frontend:

```bash
npm install react-router-dom
npm run dev
```

Frontend will start at:

```
http://localhost:5173
```

---

##  Test Credentials (Optional)

You can register a new user

---

## 📂 Folder Structure (Simplified)

```
gigFlow/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── utils/
│   └── main.jsx
```

---

##  Bonus Section – Status

###  Bonus 1: Hiring Logic Integrity

* Correct bid state transitions implemented
* Only one freelancer can be hired per gig


###  Bonus 2: Real-time Notifications

* Socket.io not implemented
* Planned enhancement for real-time hire notifications

---

##  Demo Video

A short demo video explaining the hiring flow and dashboard is included 

https://drive.google.com/file/d/1xNvgu4BgTNErHshPLsQ0DacRa1p8hrrM/view?usp=drive_link





---

##  Author

**Sarthak Kumar**
GitHub: [https://github.com/Sarthak893](https://github.com/Sarthak893)

---

Thank you for reviewing GigFlow! 🚀
