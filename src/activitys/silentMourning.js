export default {
	bootstrap() {
		const check = () => {
			// 如果为2020-04-04
			const date = new Date()
			const year = date.getFullYear()
			const month = date.getMonth()
			const day = date.getDate()

			if(year === 2020 && (month + 1) === 4 && day === 4) {
				if(!document.documentElement.classList.contains('silent-mourning')) {
					document.documentElement.classList.add('silent-mourning')
				}
			}else {
				if(year > 2020 || (year === 2020 && (month + 1) > 4) || (year === 2020 && (month + 1) > 4 && day > 4)) {
					return clearInterval(window.mourningTimer)
				}

				if(document.documentElement.classList.contains('silent-mourning')) {
					document.documentElement.classList.remove('silent-mourning')
				}
			}
		}

		window.mourningTimer = setInterval(check, 1000 * 60)

		check()
	}
}
