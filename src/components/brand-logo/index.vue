<template>
	<div class="brand-logo-wrapper-box">
		<router-link
			class="logo-box"
			to="/">
			<img
				class="cat-img"
				src="@/assets/images/logo.png">
		</router-link>
	</div>
</template>

<script>
export default {
	name: 'BrandLogo'
}
</script>

<style lang="stylus" scoped>
.brand-logo-wrapper-box
	overflow hidden
	width 200px
	height 100px
	flex-shrink 0
	padding-right 1px

	.logo-box
		overflow hidden
		display block
		width 100%

		.cat-img
			width 100%
			height 100px
</style>
