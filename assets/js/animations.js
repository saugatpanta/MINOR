// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
  // Initialize scroll animations
  initScrollAnimations();
  
  // Initialize hover animations
  initHoverAnimations();
  
  // Initialize click animations
  initClickAnimations();
});

// Initialize Scroll Animations
function initScrollAnimations() {
  // Animate elements when they come into view
  const animateOnScroll = (elements, animationClass) => {
    if (!elements.length) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add(animationClass);
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1
    });
    
    elements.forEach(element => {
      observer.observe(element);
    });
  };
  
  // Animate elements with specific classes
  animateOnScroll(document.querySelectorAll('.scroll-fade-in'), 'fade-in');
  animateOnScroll(document.querySelectorAll('.scroll-slide-up'), 'slide-up');
  animateOnScroll(document.querySelectorAll('.scroll-slide-down'), 'slide-down');
  animateOnScroll(document.querySelectorAll('.scroll-slide-left'), 'slide-left');
  animateOnScroll(document.querySelectorAll('.scroll-slide-right'), 'slide-right');
}

// Initialize Hover Animations
function initHoverAnimations() {
  // Add hover effects to buttons
  document.querySelectorAll('.btn-hover-animate').forEach(button => {
    button.addEventListener('mouseenter', function() {
      this.classList.add('hover-animate');
    });
    
    button.addEventListener('mouseleave', function() {
      this.classList.remove('hover-animate');
    });
  });
  
  // Add hover effects to cards
  document.querySelectorAll('.card-hover-animate').forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.classList.add('card-hover');
    });
    
    card.addEventListener('mouseleave', function() {
      this.classList.remove('card-hover');
    });
  });
  
  // Add hover effects to images
  document.querySelectorAll('.img-zoom-container').forEach(container => {
    container.addEventListener('mouseenter', function() {
      this.querySelector('.img-zoom').classList.add('zoom');
    });
    
    container.addEventListener('mouseleave', function() {
      this.querySelector('.img-zoom').classList.remove('zoom');
    });
  });
}

// Initialize Click Animations
function initClickAnimations() {
  // Add ripple effect to buttons
  document.querySelectorAll('.ripple').forEach(button => {
    button.addEventListener('click', function(e) {
      // Remove any existing ripple
      const existingRipple = this.querySelector('.ripple-effect');
      if (existingRipple) {
        existingRipple.remove();
      }
      
      // Create new ripple
      const ripple = document.createElement('span');
      ripple.classList.add('ripple-effect');
      
      // Position ripple
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      
      this.appendChild(ripple);
      
      // Remove ripple after animation
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
  
  // Add pulse effect to buttons
  document.querySelectorAll('.btn-pulse').forEach(button => {
    button.addEventListener('click', function() {
      this.classList.add('pulse');
      
      setTimeout(() => {
        this.classList.remove('pulse');
      }, 600);
    });
  });
  
  // Add jelly effect to buttons
  document.querySelectorAll('.jelly').forEach(button => {
    button.addEventListener('click', function() {
      this.classList.add('jelly-animate');
      
      setTimeout(() => {
        this.classList.remove('jelly-animate');
      }, 600);
    });
  });
}

// Helper function to check if element is in viewport
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}