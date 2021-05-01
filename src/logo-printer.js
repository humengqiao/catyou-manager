const origin = window.location.origin
const logoUrl = origin + process.env.BASE_URL + '/favicon.ico'

console.log('%c ',
  `
	padding: 100px 200px;
  background-image: url(${logoUrl});
  background-size: cover;
  background-repeat: no-repeat;
	border-radius: 4px;
  color: transparent;`)

console.log('%c Cat You Brand Released, All Right Reserved', 'margin-left: 10px;padding-right: 5px;font-size: 20px;color: #fff;background-image: linear-gradient(to right, #e92758, #ff9569);border-radius: 4px;')
