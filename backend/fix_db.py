import psycopg2

# Connect to database
conn = psycopg2.connect(
    host="localhost",
    database="odooxgcet",
    user="postgres",
    password="root"
)

cursor = conn.cursor()

try:
    # Alter the column type
    cursor.execute("ALTER TABLE leave_table ALTER COLUMN end_date TYPE date USING NULL;")
    conn.commit()
    print("✓ Successfully altered end_date column to date type")
except Exception as e:
    print(f"Error: {e}")
    conn.rollback()
finally:
    cursor.close()
    conn.close()
