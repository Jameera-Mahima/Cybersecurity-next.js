"use client";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    setIsLoggedIn(!!token);
    setUserRole(role);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    setIsLoggedIn(false);
    setUserRole(null);
    router.push('/login');
  };

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/courses', label: 'Courses' },
    ...(isLoggedIn
      ? [
          { href: '/dashboard', label: 'Dashboard' },
          { href: '/profile', label: 'Profile' },
        ]
      : [
          { href: '/login', label: 'Login' },
          { href: '/register', label: 'Register' },
        ]),
  ];

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <div style={styles.brand}>
          <Link href="/" style={styles.brandLink}>
            E-Learning Platform
          </Link>
        </div>
        <ul style={styles.navList}>
          {navItems.map((item) => (
            <li key={item.href} style={styles.navItem}>
              <Link
                href={item.href}
                style={{
                  ...styles.navLink,
                  ...(pathname === item.href ? styles.activeLink : {}),
                }}
              >
                {item.label}
              </Link>
            </li>
          ))}
          {isLoggedIn && (
            <li style={styles.navItem}>
              <button
                onClick={handleLogout}
                style={styles.logoutButton}
              >
                Logout
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    padding: '1rem 0',
  } as React.CSSProperties,
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  } as React.CSSProperties,
  brand: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
  } as React.CSSProperties,
  brandLink: {
    color: '#333',
    textDecoration: 'none',
  } as React.CSSProperties,
  navList: {
    display: 'flex',
    listStyle: 'none',
    margin: 0,
    padding: 0,
  } as React.CSSProperties,
  navItem: {
    marginLeft: '1.5rem',
  } as React.CSSProperties,
  navLink: {
    color: '#666',
    textDecoration: 'none',
    padding: '0.5rem',
    borderRadius: '4px',
    transition: 'all 0.3s ease',
  } as React.CSSProperties,
  activeLink: {
    color: '#007bff',
    backgroundColor: '#f8f9fa',
  } as React.CSSProperties,
  logoutButton: {
    background: 'none',
    border: 'none',
    color: '#666',
    cursor: 'pointer',
    padding: '0.5rem',
    borderRadius: '4px',
    transition: 'all 0.3s ease',
  } as React.CSSProperties,
}; 