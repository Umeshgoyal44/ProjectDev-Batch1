# ProjectDev-Batch1

## Project Structure

```text
ProjectDev-Batch1/
├── backend/
│   ├── package.json
│   ├── server.js
│   └── models/
│       ├── Ride.js
│       └── User.js
├── Carpooling_Project/
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   ├── eslint.config.js
│   ├── README.md
│   ├── public/
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── App.css
│       ├── index.css
│       └── components/
│           ├── AuthLanding.jsx
│           ├── Home.jsx
│           ├── Login.jsx
│           └── Signup.jsx
└── README.md
```

## To Run This Project

Open two terminals and run the following:

### 1. Start Backend

```bash
cd backend
npm i
npm run dev
```

### 2. Start Frontend

```bash
cd Carpooling_Project
npm i
npm run dev
```

## Notes

- Backend runs on port `5001` (default from server config).
- Frontend uses Vite dev server and proxies API requests to backend.


