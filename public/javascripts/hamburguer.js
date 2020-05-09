document.querySelector('.menu').addEventListener('click', () => {
  document.querySelector('.side-menu').classList.toggle('show')
  document.querySelector('.first').classList.toggle('start')
  document.querySelector('.second').classList.toggle('middle')
  document.querySelector('.third').classList.toggle('end')
})