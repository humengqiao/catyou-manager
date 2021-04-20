<template>
	<div class="container">
		<h3>{{ $route.query.code }}</h3>
		<div>{{ formatCode($route.query.code) }}</div>
	</div>
</template>

<script>
export default {
	name: 'Error',
	data() {
		return {
			codeDesc: {
				401: '未授权',
				404: '页面未找到'
			}
		}
	},
	methods: {
		formatCode(code) {
			const codeDesc = this.codeDesc
			return codeDesc[code]
		}
	}
}
</script>

<style lang="stylus" scoped>
	.container
		display flex
		flex-direction column
		justify-content center
		align-items center
		height 100%

		& > *
			font-size 18px
</style>
