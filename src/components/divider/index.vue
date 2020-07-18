<template>
	<div class="divider-container"></div>
</template>

<script>
import store from '@/store'

console.log(store)

export default {
	name: 'Divider'
}
</script>

<style lang="stylus" scoped>
	.divider-container
		border-bottom 1px dashed #999
</style>
