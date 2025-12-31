# Shopper Insights API Documentation

Welcome to the Shopper Insights API. This document provides a detailed overview of all available endpoints, including request/response schemas and examples.

The API is versioned and all routes are prefixed with `/api/v1/`. For frontend consumption, proxy rewrites are in place, allowing calls to be made to cleaner paths (e.g., `/api/receipts`).

## Table of Contents

1.  [Receipts](#receipts)
2.  [Budgets](#budgets)
3.  [Insights](#insights)
4.  [Users](#users)
5.  [Community](#community)

---

## Receipts

Endpoints for managing receipts.

### `GET /api/receipts`

-   **Description**: Retrieves a list of all receipts for the user.
-   **Request Schema**: None.
-   **Response Schema (200 OK)**:
    ```json
    [
      {
        "id": "string",
        "store": "string",
        "date": "string (ISO 8601)",
        "total": "number",
        "items": "number",
        "status": "processing | success | error",
        "imageUrl": "string"
      }
    ]
    ```

### `POST /api/receipts`

-   **Description**: Creates a new receipt for processing.
-   **Request Schema**:
    ```json
    {
      "store": "string",
      "date": "string (ISO 8601)",
      "total": "number",
      "items": "number",
      "imageUrl": "string"
    }
    ```
-   **Response Schema (201 Created)**: The newly created receipt object with an assigned `id` and `status: "processing"`.

### `POST /api/receipts/ocr`

-   **Description**: Submits a receipt image for OCR processing.
-   **Request Schema**: `FormData` containing the image file.
-   **Response Schema (200 OK)**: A confirmation message or initial processing status.

### `GET /api/receipts/:id`

-   **Description**: Retrieves detailed information for a single receipt.
-   **Request Schema**: URL parameter `id` (string).
-   **Response Schema (200 OK)**:
    ```json
    {
      "id": "string",
      "store": "string",
      // ...all fields from the list view
      "categories": [
        { "name": "string", "amount": "number", "percentage": "number" }
      ],
      "itemsList": [
        { "name": "string", "price": "number", "quantity": "number", "category": "string" }
      ]
    }
    ```

### `DELETE /api/receipts/:id`

-   **Description**: Deletes a specific receipt.
-   **Request Schema**: URL parameter `id` (string).
-   **Response Schema (200 OK)**:
    ```json
    { "message": "Receipt deleted" }
    ```

### `GET /api/receipts/:id/status`

-   **Description**: Polls for the processing status of a receipt.
-   **Request Schema**: URL parameter `id` (string).
-   **Response Schema (200 OK)**:
    ```json
    { "status": "processing | success | error" }
    ```

---

## Budgets

Endpoints for managing user budgets.

### `GET /api/budgets`

-   **Description**: Retrieves all budgets for the user.
-   **Request Schema**: None.
-   **Response Schema (200 OK)**:
    ```json
    [
      {
        "id": "string",
        "category": "string",
        "amount": "number",
        "spent": "number",
        "period": "monthly | weekly | yearly"
      }
    ]
    ```

### `POST /api/budgets`

-   **Description**: Creates a new budget.
-   **Request Schema**:
    ```json
    {
      "category": "string",
      "amount": "number",
      "spent": 0,
      "period": "monthly | weekly | yearly"
    }
    ```
-   **Response Schema (201 Created)**: The newly created budget object.

---

## Insights

Endpoints for generating AI-powered recommendations.

### `POST /api/recommendations`

-   **Description**: Generates a new spending insight based on user data.
-   **Request Schema**: (Optional) Can include user spending data for more personalized insights.
-   **Response Schema (200 OK)**:
    ```json
    { "insight": "string" }
    ```

---

## Users

Endpoints for user management (admin only).

### `GET /api/users`

-   **Description**: Retrieves a list of all application users.
-   **Request Schema**: None.
-   **Response Schema (200 OK)**:
    ```json
    [
      {
        "id": "string",
        "name": "string",
        "email": "string",
        "avatar": "string (URL)",
        "role": "admin | user",
        "createdAt": "string (ISO 8601)"
      }
    ]
    ```

---

## Community

Endpoints for community features like posts and challenges.

### `GET /api/community/posts`

-   **Description**: Retrieves all community posts.
-   **Request Schema**: None.
-   **Response Schema (200 OK)**: `Array` of post objects.

### `GET /api/community/challenges`

-   **Description**: Retrieves all active community challenges.
-   **Request Schema**: None.
-   **Response Schema (200 OK)**: `Array` of challenge objects.