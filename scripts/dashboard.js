document.addEventListener('DOMContentLoaded', function () {
    logoutBtn.addEventListener('click', function () {
        localStorage.removeItem('authToken');
        sessionStorage.removeItem('currentUser');
        sessionStorage.removeItem('isAdmin');
        
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 100);
    });
    
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        // Load theme preference on startup
        const darkModeEnabled = localStorage.getItem('darkMode') === 'true';
        if (darkModeEnabled) {
            document.body.classList.add('dark-mode');
            themeToggle.textContent = '☀️';
        } else {
            themeToggle.textContent = '🌙';
        }

        themeToggle.addEventListener('click', function (event) {
            event.preventDefault();
            const isDark = document.body.classList.toggle('dark-mode');
            localStorage.setItem('darkMode', isDark);
            themeToggle.textContent = isDark ? '☀️' : '🌙';
        });
    }
});
