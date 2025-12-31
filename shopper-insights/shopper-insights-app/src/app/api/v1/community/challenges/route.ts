import { NextResponse } from "next/server";

const challenges = [
  {
    id: "c1",
    title: "Weekly Savings Challenge",
    description: "Save as much as you can on groceries this week!",
    participants: 42,
    duration: "7 days",
    reward: "$50 Gift Card",
    category: "Savings",
  },
  {
    id: "c2",
    title: "Healthy Eating Challenge",
    description: "Buy at least 5 healthy items in your next grocery trip.",
    participants: 28,
    duration: "5 days",
    reward: "Badge + $20",
    category: "Health",
  },
];

export async function GET() {
  return NextResponse.json(challenges);
}
