# Sawaari

A full-stack car rental platform. Next.js frontend, Express backend, MongoDB database.

## Stack

**Frontend:** Next.js 15, TypeScript, Tailwind CSS  
**Backend:** Node.js, Express, MongoDB, Mongoose  
**Auth:** JWT  
**Payments:** Razorpay

## Getting Started

### Prerequisites

- Node.js 18.18+
- MongoDB (Atlas or local)
- Razorpay account (for payments)

### Backend Setup

```bash
cd server
npm install
```

Create `server/.env`:

```
PORT=8000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_min_32_chars
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
ALLOWED_ORIGINS=http://localhost:3000
CLIENT_URL=http://localhost:3000
```

```bash
npm start
```

Runs on `http://localhost:8000`

### Frontend Setup

```bash
cd client
npm install
```

Create `client/.env`:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
```

```bash
npm run dev
```

Runs on `http://localhost:3000`

## Project Structure

```
├── client/                 # Next.js frontend
│   ├── app/               # Pages (app router)
│   ├── components/        # UI components
│   ├── lib/               # API client, auth, utils
│   └── hooks/             # Custom hooks
│
└── server/                 # Express backend
    ├── Controllers/       # Route handlers
    ├── Models/            # Mongoose schemas
    ├── Routes/            # API routes
    ├── middleware/        # Auth, validation
    └── Db/                # DB connection
```

## API Routes

### Cars
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cars/` | List all cars |
| POST | `/api/cars/addcar` | Add car (admin) |
| PUT | `/api/cars/editcar` | Update car (admin) |
| DELETE | `/api/cars/deletecar` | Delete car (admin) |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users/login` | Login |
| POST | `/api/users/register` | Register |

### Bookings
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/bookings/bookcar` | Create booking |
| GET | `/api/bookings/getallbookings` | Get user bookings |
| POST | `/api/bookings/verify-payment` | Verify payment |

## License

MIT

## Author

**Jinkz**

<div align="center">
  
### ⭐ Star this repo if you find it helpful!

Built with ❤️

</div>
