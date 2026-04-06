# 📝 Real-Time Collaborative Notes App

A full-stack **MERN + MySQL + Socket.io** based Notes Application with **Authentication, RBAC (Role-Based Access Control), Collaboration, Sharing, and Activity Tracking**.

---

## 🚀 Features

### 🔐 Authentication & Authorization

* User Registration & Login (JWT आधारित)
* Secure API access using tokens
* Role-Based Access Control (ADMIN, EDITOR, VIEWER)

### 📝 Notes Management

* Create, Read, Update, Delete (CRUD)
* Rich text editing support
* Search functionality

### 👥 Collaboration System

* Add collaborators to notes
* Roles:

  * **Editor** → can edit
  * **Viewer** → read-only
* Owner/Admin control access

### 🔗 Share Notes

* Generate secure shareable links
* Public access via token-based URLs

### 📡 Real-Time Editing (Socket.io)

* Live updates across users
* Room-based note collaboration

### 📜 Activity Logs

* Track actions:

  * Create
  * Update
  * Delete
  * Share
* Per-note activity tracking

---

## 🏗️ Tech Stack

### Frontend

* React.js (Vite)
* Bootstrap
* Axios
* React Router

### Backend

* Node.js
* Express.js
* MySQL
* Socket.io

### Authentication

* JWT (JSON Web Token)

---

## 📂 Project Structure

```
client/
  ├── pages/
  ├── components/
  ├── api/
  ├── context/

server/
  ├── controllers/
  ├── models/
  ├── routes/
  ├── middleware/
  ├── sockets/
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

---

### 2️⃣ Backend Setup

```bash
cd server
npm install
```

Create `.env` file:

```env
PORT=5000
DATABASE_URL=your_mysql_connection
JWT_SECRET=your_secret_key
BASE_URL=http://localhost:5000
```

Run server:

```bash
npm run dev
```

---

### 3️⃣ Frontend Setup

```bash
cd client
npm install
npm run dev
```

---

## 🗄️ Database Tables

### Notes

* id
* title
* content
* owner_id

### Collaborators

* note_id
* user_id
* role

### Share Links

* note_id
* token

### Activity Logs

* user_id
* note_id
* action
* created_at

---

## 🔐 Roles & Permissions

| Role   | Access                    |
| ------ | ------------------------- |
| ADMIN  | Full access (all notes)   |
| OWNER  | Full control of own notes |
| EDITOR | Can edit shared notes     |
| VIEWER | Read-only access          |

---

## 🔗 API Endpoints (Sample)

```
POST   /api/auth/register
POST   /api/auth/login

GET    /api/notes
POST   /api/notes
PUT    /api/notes/:id
DELETE /api/notes/:id

POST   /api/notes/:id/share
GET    /api/notes/public/:token

GET    /api/activity
```

---

## 📸 Screens (Optional)

* Dashboard
* Note Editor
* Activity Logs
* Collaboration UI

---

## 💡 Future Improvements

* Rich text editor (Quill / Slate)
* Typing indicators (real-time)
* User profile system
* Notifications
* Dark mode

---

## 👨‍💻 Author

**Gareeb Nawaz**

* MERN Stack Developer
* Skilled in JavaScript, Node.js, React, MySQL

---

## ⭐ If you like this project

Give it a ⭐ on GitHub and share!

---
