window.addEventListener('DOMContentLoaded', function() {
  const popup = document.getElementById('fullscreen-popup');
  if (popup) {
    popup.style.display = 'flex';
    setTimeout(() => {
      popup.style.display = 'none';
    }, 2000);
  }
});

