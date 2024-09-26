import './style.css'

const darkModeButton = document.getElementById('dark-mode')

console.log(darkModeButton)

function toggleDarkMode() {
  document.body.classList.toggle('dark-mode')
}

darkModeButton.addEventListener('click', toggleDarkMode)