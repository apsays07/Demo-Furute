"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./Navbar.module.css";

const menuItems = [
  "Home",
  "About Us",
  "Programs",
  "Services",
  "Events",
  "Blog",
  "Testimonials",
  "Contact Us",
];

function getSectionId(item) {
  return item.toLowerCase().replace(/\s+/g, "-");
}

export default function Navbar() {
  const [activeItem, setActiveItem] = useState("Home");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleLocation = () => {
        if (window.location.pathname === "/contact") {
          setActiveItem("Contact Us");
        } else if (window.location.pathname === "/about") {
          setActiveItem("About Us");
        } else {
          const hash = window.location.hash;
          if (hash) {
            const matched = menuItems.find(
              (item) => `/#${getSectionId(item)}` === `/${hash}` || `#${getSectionId(item)}` === hash
            );
            if (matched) setActiveItem(matched);
          } else {
            setActiveItem("Home");
          }
        }
      };

      handleLocation();
      window.addEventListener("hashchange", handleLocation);
      return () => window.removeEventListener("hashchange", handleLocation);
    }
  }, []);

  return (
    <nav className={styles.navbar}>
      <Link className={styles.navbarLogo} href="/" aria-label="Furute home">
        <span className={styles.logoMark} aria-hidden="true">
          <img src="/furute-logo.png" alt="" />
        </span>
      </Link>

      <ul className={styles.navbarMenu}>
        {menuItems.map((item) => (
          <li key={item}>
            {item === "Contact Us" ? (
              <Link
                className={activeItem === item ? styles.active : undefined}
                href="/contact"
                aria-current={activeItem === item ? "page" : undefined}
                onClick={() => setActiveItem(item)}
              >
                {item}
              </Link>
            ) : item === "About Us" ? (
              <Link
                className={activeItem === item ? styles.active : undefined}
                href="/about"
                aria-current={activeItem === item ? "page" : undefined}
                onClick={() => setActiveItem(item)}
              >
                {item}
              </Link>
            ) : (
              <a
                className={activeItem === item ? styles.active : undefined}
                href={`/#${getSectionId(item)}`}
                aria-current={activeItem === item ? "page" : undefined}
                onClick={() => setActiveItem(item)}
              >
                {item}
              </a>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
