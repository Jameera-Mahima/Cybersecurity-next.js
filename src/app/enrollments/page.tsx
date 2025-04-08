"use client";
import { useEffect, useState } from "react";

interface Enrollment {
    enrollmentId: string;
    courseId: string;
    userId: string;
  }

  export default function EnrollmentListPage() {
    const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

  useEffect(() => {
      const fetchEnrollments = async () => {
        try {
          const response = await fetch('https://localhost:7099/api/Enrollments');
          if (!response.ok) throw new Error(`Failed to fetch enrollments: ${response.statusText}`);
          const data = await response.json();

          setEnrollments(data.enrollments);
        } catch (err) {
          setError((err as Error).message);
        } finally {
          setLoading(false);
        }
      };
      fetchEnrollments();
    }, []);

    if (loading) return <p style={{ textAlign: "center", fontSize: "1.2rem", color: "#555" }}>Loading...</p>;
    if (error) return <div style={{ textAlign: "center", color: "red" }}>{error}</div>;

    return (
        <div style={styles.container}>
        <h1 style={styles.heading}> Enrollment List </h1>
        {enrollments.length === 0 ? (
            <p style={styles.noEnrollments}>No Enrollments found.</p>
        ) : (
            <ul style={styles.list}>
            {enrollments.map((enrollment) => (
                <li key={enrollment.enrollmentId} style={styles.listItem}>
                    <strong>Enrollment ID:</strong> {enrollment.enrollmentId} <br />
                    <strong>Course ID:</strong> {enrollment.courseId} <br />
                    <strong>User ID:</strong> {enrollment.userId}
                </li>
                ))}
            </ul>
        )}
        </div>
    );
}

const styles = {
    container: {
      maxWidth: "800px",
      margin: "2rem auto",
      padding: "1.5rem",
      backgroundColor: "#f9f9f9",
      borderRadius: "8px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      fontFamily: "'Arial', sans-serif",
    } as React.CSSProperties,
    heading: {
      textAlign: "center" as React.CSSProperties["textAlign"],
      fontSize: "2rem",
      color: "#333",
      marginBottom: "1.5rem",
      borderBottom: "2px solid #007BFF",
      paddingBottom: "0.5rem",
    },
    list: {
      listStyleType: "none",
      paddingLeft: "0",
    },
    listItem: {
      backgroundColor: "#fff",
      padding: "1rem",
      marginBottom: "1rem",
      borderRadius: "4px",
      boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
      lineHeight: "1.6",
    },
    noEnrollments: {
      textAlign: "center",
      color: "#777",
      fontSize: "1.2rem",
    }as React.CSSProperties,
  };