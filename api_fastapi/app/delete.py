from db import engine
from sqlalchemy import text

def delete_all_receipts():
    with engine.connect() as connection:
        connection.execute(text("DELETE FROM receipts"))
        connection.commit()
        print("✅ All receipts have been deleted successfully.")

if __name__ == "__main__":
    delete_all_receipts()