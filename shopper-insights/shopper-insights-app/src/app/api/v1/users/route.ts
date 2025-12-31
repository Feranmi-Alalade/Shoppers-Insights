import { NextResponse } from "next/server";

const users = [
  {
    id: "u1",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    avatar: "/api/placeholder/32/32",
    role: "admin",
    createdAt: "2025-07-01T10:00:00Z",
  },
  {
    id: "u2",
    name: "Mike Lee",
    email: "mike.lee@email.com",
    avatar: "/api/placeholder/32/32",
    role: "user",
    createdAt: "2025-07-05T14:30:00Z",
  },
  {
    id: "u3",
    name: "Emily Chen",
    email: "emily.chen@email.com",
    avatar: "/api/placeholder/32/32",
    role: "user",
    createdAt: "2025-07-10T09:45:00Z",
  },
];

export async function GET() {
  return NextResponse.json(users);
}
