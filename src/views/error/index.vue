<template>
	<div class="container">
		<h3>401</h3>
		<div>页面未找到</div>
	</div>
</template>

<script>
export default {
	name: 'Error'
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