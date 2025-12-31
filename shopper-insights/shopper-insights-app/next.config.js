/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      // Receipts
      {
        source: "/api/receipts",
        destination: "/api/v1/receipts",
      },
      {
        source: "/api/receipts/ocr",
        destination: "/api/v1/receipts/ocr",
      },
      {
        source: "/api/receipts/:id",
        destination: "/api/v1/receipts/:id",
      },
      {
        source: "/api/receipts/:id/status",
        destination: "/api/v1/receipts/:id/status",
      },
      // Budgets
      {
        source: "/api/budgets",
        destination: "/api/v1/budgets",
      },
      // Insights
      {
        source: "/api/recommendations",
        destination: "/api/v1/insights/recommendations",
      },
      // Users & Community
      {
        source: "/api/users",
        destination: "/api/v1/users",
      },
      {
        source: "/api/community/posts",
        destination: "/api/v1/community/posts",
      },
      {
        source: "/api/community/challenges",
        destination: "/api/v1/community/challenges",
      },
    ];
  },
};

module.exports = nextConfig;
