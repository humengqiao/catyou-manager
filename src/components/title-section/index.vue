<template>
	<div class="title-container">
		<h3 class="title">{{ title }}</h3>
		<slot>
			<div class="total">共<strong style="color: #ff0000;">{{ count }}</strong>{{ unit }}</div>
		</slot>
	</div>
</template>

<script>
export default {
	name: 'TitleCount',
	props: {
		title: {
			required: true,
			type: String,
			default: ''
		},
		count: {
			type: [String, Number],
			default: 0
		},
		unit: {
			type: String,
			default: '个'
		}
	}
}
</script>

<style lang="stylus" scoped>
	.title-container
		display flex
		flex-direction row
		justify-content space-between
		align-items center
		margin-top 30px

		.title
			font-size 16px !important

		.total
			font-size 12px
</style>