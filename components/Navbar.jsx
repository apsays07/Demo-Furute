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

const programDropdown = {
  label: "Programs",
  subcategories: [
    {
      label: "Training Programs",
      path: "/programs#training",
      items: [
        { label: "Insights", path: "/programs/training/insights" },
        { label: "Organization Training", path: "/programs/training/organization-training" },
        { label: "Breakthrough", path: "/programs/training/breakthrough" },
        { label: "Sarathi", path: "/programs/training/sarathi" },
        { label: "Beyond the Classroom", path: "/programs/training/beyond-the-classroom" },
        { label: "YOUNG ADULTS", path: "/programs/training/young-adults" },
      ]
    },
    {
      label: "1 Day Training Programs",
      path: "/programs#1-day",
      items: [
        { label: "Goal Setting", path: "/programs/1-day/goal-setting" },
        { label: "Business Communication", path: "/programs/1-day/business-communication" },
        { label: "Leadership and Negotiation", path: "/programs/1-day/leadership-and-negotiation" },
      ]
    },
    {
      label: "Relationship Tourism",
      path: "/programs/relationship-tourism",
      isLeaf: true
    }
  ]
};

function getSectionId(item) {
  return item.toLowerCase().replace(/\s+/g, "-");
}

export default function Navbar() {
  const [activeItem, setActiveItem] = useState("Home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProgramsExpanded, setIsProgramsExpanded] = useState(false);
  const [expandedSubcat, setExpandedSubcat] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleLocation = () => {
        const path = window.location.pathname;
        if (path === "/contact") {
          setActiveItem("Contact Us");
        } else if (path === "/about") {
          setActiveItem("About Us");
        } else if (path.startsWith("/programs")) {
          setActiveItem("Programs");
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

  const handleLinkClick = (item) => {
    setActiveItem(item);
    setIsMobileMenuOpen(false);
    setIsProgramsExpanded(false);
    setExpandedSubcat(null);
  };

  const handleProgramsClick = (e) => {
    if (window.innerWidth <= 980) {
      e.preventDefault();
      setIsProgramsExpanded(!isProgramsExpanded);
    } else {
      handleLinkClick("Programs");
    }
  };

  const handleSubcatClick = (e, subcatLabel, isLeaf) => {
    if (window.innerWidth <= 980) {
      e.preventDefault();
      if (!isLeaf) {
        setExpandedSubcat(expandedSubcat === subcatLabel ? null : subcatLabel);
      }
    }
  };

  return (
    <nav className={styles.navbar}>
      <Link className={styles.navbarLogo} href="/" aria-label="Furute home">
        <span className={styles.logoMark} aria-hidden="true">
          <img src="/furute-logo.png" alt="Furute Logo" />
        </span>
      </Link>

      {/* Hamburger Toggle Button for Mobile */}
      <button 
        className={styles.hamburger} 
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle navigation menu"
        aria-expanded={isMobileMenuOpen}
      >
        <span className={styles.bar}></span>
        <span className={styles.bar}></span>
        <span className={styles.bar}></span>
      </button>

      <ul className={`${styles.navbarMenu} ${isMobileMenuOpen ? styles.menuOpen : ""}`}>
        {menuItems.map((item) => {
          if (item === "Programs") {
            return (
              <li key={item} className={styles.dropdown}>
                <Link
                  className={`${activeItem === item ? styles.active : undefined} ${styles.dropdownTrigger} ${isProgramsExpanded ? styles.expanded : ""}`}
                  href="/programs"
                  aria-current={activeItem === item ? "page" : undefined}
                  onClick={handleProgramsClick}
                >
                  {item} <span className={styles.chevron} aria-hidden="true">˅</span>
                </Link>

                <ul className={`${styles.dropdownMenu} ${isProgramsExpanded ? styles.expanded : ""}`}>
                  {programDropdown.subcategories.map((subcat) => {
                    if (subcat.isLeaf) {
                      return (
                        <li key={subcat.label} className={styles.dropdownLeaf}>
                          <Link 
                            href={subcat.path} 
                            onClick={() => handleLinkClick("Programs")}
                          >
                            {subcat.label}
                          </Link>
                        </li>
                      );
                    }
                    const isSubcatExpanded = expandedSubcat === subcat.label;
                    return (
                      <li key={subcat.label} className={styles.submenu}>
                        <span 
                          className={`${styles.submenuTrigger} ${isSubcatExpanded ? styles.expanded : ""}`}
                          onClick={(e) => handleSubcatClick(e, subcat.label, false)}
                        >
                          {subcat.label}
                          <span className={styles.subChevron} aria-hidden="true">&gt;</span>
                        </span>
                        <ul className={`${styles.submenuMenu} ${isSubcatExpanded ? styles.expanded : ""}`}>
                          {subcat.items.map((subitem) => (
                            <li key={subitem.label}>
                              <Link 
                                href={subitem.path} 
                                onClick={() => handleLinkClick("Programs")}
                              >
                                {subitem.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </li>
                    );
                  })}
                </ul>
              </li>
            );
          }

          return (
            <li key={item}>
              {item === "Contact Us" ? (
                <Link
                  className={activeItem === item ? styles.active : undefined}
                  href="/contact"
                  aria-current={activeItem === item ? "page" : undefined}
                  onClick={() => handleLinkClick(item)}
                >
                  {item}
                </Link>
              ) : item === "About Us" ? (
                <Link
                  className={activeItem === item ? styles.active : undefined}
                  href="/about"
                  aria-current={activeItem === item ? "page" : undefined}
                  onClick={() => handleLinkClick(item)}
                >
                  {item}
                </Link>
              ) : (
                <a
                  className={activeItem === item ? styles.active : undefined}
                  href={`/#${getSectionId(item)}`}
                  aria-current={activeItem === item ? "page" : undefined}
                  onClick={() => handleLinkClick(item)}
                >
                  {item}
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
