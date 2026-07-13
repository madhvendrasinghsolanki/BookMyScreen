# 🎬 Book My Screen

Book My Screen is a full-stack movie ticket booking web application built using the MERN stack. It provides a simple and user-friendly platform where users can browse movies, search for their favorites, select seats, and book tickets online. The application also includes an admin dashboard for managing movies, bookings, and users. This project was developed to enhance my full-stack development skills and demonstrate practical experience with modern web technologies.

---

## 🚀 Features

- 🔐 User Registration & Login
- 🎥 Live Movie Search
- 🎬 Movie Details
- 🪑 Interactive Seat Selection
- 🎫 Online Ticket Booking
- 📖 Booking History
- 👨‍💼 Admin Dashboard
- 📊 Dashboard Analytics
- 🌙 Dark Mode
- 📱 Responsive Design

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Vite
- React Router
- Axios

### Backend
- Node.js
- Express.js
- TypeScript

### Database
- MongoDB

---

## 📦 Installation


### Install Frontend

```bash
cd bms-frontend
npm install
npm run dev
```

### Install Backend

```bash
cd bms-backend
npm install
npm run dev
```

---

## 🔑 Environment Variables

Create a `.env` file in both the frontend and backend.

### Backend

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
ACCESS_TOKEN_SECRET=your_secret_key
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

### Frontend

```env
VITE_BACKEND_URL=http://localhost:9000
```

### Production deployment

- Render backend: set `MONGODB_URI`, `ACCESS_TOKEN_SECRET`, `OMDB_API_KEY`, and `FRONTEND_URL`.
- Vercel frontend: set `VITE_BACKEND_URL` to your deployed backend URL.
- If `MONGODB_URI` is missing in production, the backend now stops with a clear error instead of falling back to localhost.

---


## 🎯 Future Improvements

- 💳 Online Payment Integration
- 📧 Email Ticket Confirmation
- 📄 PDF Ticket Download
- ⭐ Movie Ratings & Reviews
- 📈 Advanced Analytics
- 🔔 Real-time Notifications

---

## 👨‍💻  Developer

**Madhvendra Singh Solanki**

B.Tech Computer Science & Engineering Student 

Passionate about Full stack Development , building scalable web application , and continously learning new technologies.

---

## 📄 License

This project is created for educational and portfolio purposes.