HEAD
const menuToggle = document.querySelector('.menu-toggle');
const navbar = document.querySelector('.navbar');

menuToggle.addEventListener('click', () => {
  const expanded = menuToggle.getAttribute('aria-expanded') === 'true' || false;
  menuToggle.setAttribute('aria-expanded', !expanded);
  navbar.classList.toggle('active');

  // Change icon to X or bars
  const icon = menuToggle.querySelector('i');
  if (navbar.classList.contains('active')) {
    icon.classList.remove('fa-bars');
    icon.classList.add('fa-xmark');
  } else {
    icon.classList.remove('fa-xmark');
    icon.classList.add('fa-bars');
  }
});

// Optional: close menu when clicking a nav link on mobile
document.querySelectorAll('.navbar a').forEach(link => {
  link.addEventListener('click', () => {
    if (navbar.classList.contains('active')) {
      navbar.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', false);
      menuToggle.querySelector('i').classList.remove('fa-xmark');
      menuToggle.querySelector('i').classList.add('fa-bars');
    }
  });
});
const menuToggle = document.querySelector('.menu-toggle');
const navbar = document.querySelector('.navbar');

menuToggle.addEventListener('click', () => {
  const expanded = menuToggle.getAttribute('aria-expanded') === 'true' || false;
  menuToggle.setAttribute('aria-expanded', !expanded);
  navbar.classList.toggle('active');

  // Change icon to X or bars
  const icon = menuToggle.querySelector('i');
  if (navbar.classList.contains('active')) {
    icon.classList.remove('fa-bars');
    icon.classList.add('fa-xmark');
  } else {
    icon.classList.remove('fa-xmark');
    icon.classList.add('fa-bars');
  }
});

// Optional: close menu when clicking a nav link on mobile
document.querySelectorAll('.navbar a').forEach(link => {
  link.addEventListener('click', () => {
    if (navbar.classList.contains('active')) {
      navbar.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', false);
      menuToggle.querySelector('i').classList.remove('fa-xmark');
      menuToggle.querySelector('i').classList.add('fa-bars');
    }
  });
});
