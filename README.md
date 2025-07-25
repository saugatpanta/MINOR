# Pashupati Aluminium - Web Application

## Overview
Pashupati Aluminium is a comprehensive web application for an aluminium manufacturing company, showcasing their products, projects, and services. The application includes a public-facing website and three distinct dashboard interfaces for clients, employees, and administrators.

## Features

### Public Website
- **Home Page**: Introduction to the company and featured products
- **Products**: Detailed catalogue of aluminium products with filtering options
- **Projects**: Showcase of completed projects with case studies
- **About Us**: Company history, milestones, and team information
- **Testimonials**: Client feedback and video testimonials
- **Contact**: Contact form and company information
- **Shopping Cart**: Product selection and checkout process
- **Authentication**: User registration and login

### Dashboards
1. **Client Dashboard**:
   - Order history and tracking
   - Project status updates
   - Wishlist functionality
   - Account management

2. **Employee Dashboard**:
   - Project management tools
   - Task tracking
   - Client communication
   - Calendar scheduling

3. **Admin Dashboard**:
   - Comprehensive analytics
   - User management
   - Product inventory
   - Order processing

## Technical Stack

### Frontend
- **HTML5**: Semantic markup structure
- **CSS3**: Custom styling with animations and responsive design
- **JavaScript**: Interactive elements and dynamic content
- **Libraries**:
  - AOS (Animate On Scroll) for scroll animations
  - GSAP for advanced animations
  - Three.js for 3D elements (if implemented)
  - Chart.js for data visualization in dashboards

### Design System
- **Dark Theme**: Primary interface with dark mode aesthetics
- **Responsive Layout**: Works on all device sizes
- **Animations**: Smooth transitions and interactive elements
- **Component-Based**: Reusable UI components

## File Structure
assets/
├── css/
│ ├── animations.css # Animation styles
│ ├── auth.css # Authentication page styles
│ ├── dashboard.css # Dashboard styles
│ └── main.css # Main website styles
├── images/ # All image assets
└── js/
├── animations.js # Animation scripts
├── auth.js # Authentication logic
├── cart.js # Shopping cart functionality
├── dashboard.js # Dashboard functionality
└── main.js # Main website scripts

pages/
├── about.html # About Us page
├── admin-dashboard.html # Admin dashboard
├── cart.html # Shopping cart
├── client-dashboard.html # Client dashboard
├── employee-dashboard.html # Employee dashboard
├── login.html # Login page
├── products.html # Products page
├── register.html # Registration page
└── testimonials.html # Testimonials page

## Installation
1. Clone the repository
2. Open any HTML file in a modern web browser
3. No server requirements for static content

## Usage
- Navigate through the website using the main menu
- Register as a client to access the client dashboard
- Use the login credentials for employee/admin access (backend integration required)

## Customization
To modify the application:
1. Edit HTML files for content changes
2. Update CSS files for styling changes
3. Modify JavaScript files for behavior changes
4. Replace images in the assets folder

## Future Enhancements
- Backend integration with database
- E-commerce functionality
- Project management tools
- Mobile application version

## License
This project is open-source and available for modification and distribution.
