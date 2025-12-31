import { NextResponse } from "next/server";

const posts = [
  {
    id: "1",
    author: {
      name: "Sarah Johnson",
      avatar: "/api/placeholder/32/32",
      level: 5,
    },
    content: "Just saved $200 on groceries using the new budget tool! 🎉",
    timestamp: "2025-07-14T09:00:00Z",
    likes: 34,
    comments: 12,
    category: "Savings",
    savings: 200,
  },
  {
    id: "2",
    author: { name: "Mike Lee", avatar: "/api/placeholder/32/32", level: 3 },
    content: "Joined the weekly challenge and cut my snack spending by 30%!",
    timestamp: "2025-07-13T15:30:00Z",
    likes: 21,
    comments: 5,
    category: "Challenge",
  },
];

export async function GET() {
  return NextResponse.json(posts);
}
