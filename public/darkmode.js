// Simple Dark Mode Toggle Script
// Works for all pages consistently

document.addEventListener('DOMContentLoaded', function() {
  const toggleButton = document.getElementById('toggleMode');
  
  if (toggleButton) {
    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.body.classList.add('dark');
      toggleButton.textContent = '☀';
    }
    
    // Toggle dark mode
    toggleButton.addEventListener('click', function() {
      document.body.classList.toggle('dark');
      const isDark = document.body.classList.contains('dark');
      
      // Update button icon
      this.textContent = isDark ? '☀' : '🌙';
      
      // Save theme preference
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
  }
});