import MySQLdb
import os
from dotenv import load_dotenv

load_dotenv()

def get_db_connection():
    connection = MySQLdb.connect(
        host=os.getenv("MYSQL_HOST"),
        user=os.getenv("MYSQL_USER"),
        passwd=os.getenv("MYSQL_PASSWORD"),
        db=os.getenv("MYSQL_DB"),
        charset='utf8mb4'
    )
    return connection
