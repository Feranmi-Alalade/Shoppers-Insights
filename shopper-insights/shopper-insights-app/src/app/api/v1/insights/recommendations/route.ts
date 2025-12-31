const recommendations = [
  "You can save an average of 15% by shopping at 'Budget Foods' for groceries.",
  "Consider buying 'Brand X' coffee, which is cheaper and highly rated.",
  "Your spending on 'Dining Out' has increased by 20% this month. Set a budget to manage it.",
];

export async function POST() {
  const randomIndex = Math.floor(Math.random() * recommendations.length);
  return new Response(
    JSON.stringify({ insight: recommendations[randomIndex] }),
    {
      headers: { "Content-Type": "application/json" },
    },
  );
}
