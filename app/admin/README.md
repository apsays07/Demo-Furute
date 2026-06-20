# Furute – Leadership Development & Business Mentoring Platform

A modern, scalable, and responsive leadership development platform built with **Next.js 16**, **React 19**, **TypeScript**, and **MongoDB**. The application provides business mentoring, life coaching, speaker invitation, blog management, and contact management capabilities through an intuitive user interface and a modular architecture.

---

## Overview

Furute is designed to help individuals and organizations connect with leadership mentors, explore coaching programs, read insightful articles, and request personalized mentoring sessions.

The project follows modern software engineering practices including:

- Component-based architecture
- Type-safe development with TypeScript
- Responsive UI design
- Automated unit and integration testing
- Clean code principles
- Production-ready configuration

---

## Key Features

### Public Website

- Responsive Landing Page
- About Section
- Leadership Programs
- Blog Management
- Testimonial Section
- Video Gallery
- Contact Form
- Speaker Invitation Form

### Admin Module

- User Management
- Content Management
- Dashboard Analytics
- Authentication Support

### User Experience

- Mobile Responsive Design
- Modern UI Components
- Form Validation
- Error Handling
- Interactive Navigation

---

## Technology Stack

| Category | Technology |
|----------------|----------------|
| Framework | Next.js 16 |
| Frontend | React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | MongoDB |
| ODM | Mongoose |
| Testing | Jest |
| Component Testing | React Testing Library |
| End-to-End Testing | Playwright |
| Linting | ESLint |

---

## Project Structure

```
furute-next-js/
│
├── app/
│   ├── about/
│   ├── admin/
│   ├── api/
│   ├── blog/
│   ├── contact/
│   ├── invite/
│   └── page.tsx
│
├── components/
│   ├── layout/
│   ├── shared/
│   ├── ui/
│   └── __tests__/
│
├── lib/
├── models/
├── public/
├── tests/
├── coverage/
└── package.json
```

---

## Installation

Clone the repository

```bash
git clone https://github.com/apsays07/Demo-Furute.git
```

Navigate to the project

```bash
cd Demo-Furute
```

Install dependencies

```bash
npm install
```

---

## Running the Application

### Development

```bash
npm run dev
```

Open:

```
http://localhost:3000
```

### Production Build

```bash
npm run build
npm run start
```

---

## Available Scripts

| Command | Description |
|------------------------|---------------------------|
| npm run dev | Start development server |
| npm run build | Build production application |
| npm run start | Start production server |
| npm run lint | Run ESLint |
| npm test | Execute Jest tests |
| npm run test:coverage | Generate test coverage report |
| npx playwright test | Execute end-to-end tests |

---

## Testing

The project includes comprehensive automated testing covering components, pages, utilities, forms, and integrations.

### Test Results

```
Test Suites : 18 Passed
Tests       : 154 Passed
Snapshots   : 0 Failed
```

### Code Coverage

| Metric | Coverage |
|----------------|------------|
| Statements | **99.57%** |
| Branches | **97.08%** |
| Functions | **100%** |
| Lines | **100%** |

### Tested Modules

- Hero Section
- Navbar
- Contact Form
- Invite Speaker Form
- Blog Components
- Video Modal
- Video Section
- Testimonial Components
- Email Login Modal
- Form Controls
- Utility Functions
- Home Data
- Blog Data
- Integration Flows

---

## Code Quality

The project follows industry-standard development practices:

- TypeScript for type safety
- ESLint for code consistency
- Modular component architecture
- Reusable UI components
- Responsive layouts
- Error handling
- Form validation
- Clean folder organization

---

## Performance

Implemented optimizations include:

- Next.js App Router
- Server Components
- Lazy Loading
- Code Splitting
- Optimized Rendering
- Responsive Images
- Static Generation where applicable

---

## Deployment

The application can be deployed on **Vercel**.

Build locally:

```bash
npm run build
```

Deploy:

```bash
git add .
git commit -m "Production Release"
git push origin main
```

Import the repository into Vercel and configure environment variables.

---

## Future Enhancements

- Role-Based Access Control
- Dashboard Analytics
- Email Notifications
- Search & Filtering
- Pagination
- Internationalization
- Dark Mode
- API Documentation

---

## Author

**Aniket Patil**

GitHub

```
https://github.com/apsays07
```

---

## License

This project is licensed under the MIT License.

---

## Project Summary

- Built using **Next.js 16** and **React 19**
- Fully responsive and production-ready architecture
- Modular and reusable component structure
- Comprehensive automated testing strategy
- **18 Test Suites**
- **154 Passing Tests**
- **99.57% Statement Coverage**
- **97.08% Branch Coverage**
- **100% Function Coverage**
- **100% Line Coverage**

This project demonstrates modern full-stack web development practices, clean architecture, high code quality, and a strong focus on maintainability and reliability.