<template>
	<div class="container">
		<h3>401</h3>
		<div>未授权</div>
	</div>
</template>

<script>
export default {
	name: 'NoAuthority'
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