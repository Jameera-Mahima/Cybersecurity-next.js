"use client";
import { useEffect, useState } from "react";

interface User {
  userId: string;  
  userName: string;
}

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        console.log("Fetching users...");
        const response = await fetch('https://localhost:7099/api/Users');
        console.log("Response:", response);

        if (!response.ok) {
          throw new Error(`Failed to fetch users: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("API Response:", data);
        setUsers(data);
      } catch (err) {
        console.error("Error:", err);
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>User List</h1>
      {users.length === 0 ? <p>No users found.</p> : (
        <ul>
          {users.map((user) => (
            <li key={user.userId}>
              {user.userName}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
