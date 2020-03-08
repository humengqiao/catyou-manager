<template>
	<div class="fly-start-container">
		<div class="inner-container">
			<div class="main-con">
				<div class="shooting_star"></div>
				<div class="shooting_star"></div>
			</div>
			<div
				class="main-con"
				style="margin-top: 60px;">
				<div class="shooting_star"></div>
				<div class="shooting_star"></div>
			</div>
			<div
				class="main-con"
				style="margin-top: 120px;">
				<div class="shooting_star"></div>
				<div class="shooting_star"></div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'FlyStart'
}
</script>

<style lang="stylus" scoped>
	.fly-start-container
		overflow hidden
		position absolute
		left 0
		top 0
		right 0
		bottom 0
		background transparent
		z-index 1

		.inner-container
			display flex
			flex-direction row
			justify-content flex-end
			height 100%
			margin 0 auto
		
			.main-con
				position relative
				width 100%
				height 100%
				transform rotate(45deg)

			@keyframes tail 
				0%
					opacity 0
				
				30%
					opacity 1

				100%
					opacity 0

			@keyframes shooting-1
				0%
					transform translateY(0)
				
				100%
					transform translateY(300px)

			@keyframes shooting-2
				0%
					transform translate3d(0, 0, 0)
				
				100%
					transform translate3d(-100px, 600px, 0)
		
			.shooting_star
				position absolute
				left 50%
				top 50%
				height 3.75rem
				width .45rem
				background url(../../assets/images/meteor.png) no-repeat
				background-size 100% 100%
				opacity 0
										
				&:nth-child(1)
					top -7%
					left 5%
					height 2.75rem
					width .25rem
					animation-delay 500ms
					animation tail 3s ease-in-out 5, shooting-1 3s ease-out 5
		
				&:nth-child(2)
					top: -4%
					left: 24%
					height 3.35rem
					width .35rem
					animation-delay 0ms
					animation tail 2s ease-in-out 8, shooting-2 2s ease-out 8
		
				&:nth-child(3)
					top 5%
					left 60%
					transform scale(0.8)
					animation-delay 870ms
		
				&:nth-child(4)
					top 35%
					left 65%
					transform scale(0.6)
					animation-delay 300ms

				&:nth-child(5)
					top	55%
					left 45%
					transform scale(0.5)
					animation-delay 658ms
		
				&:nth-child(6)
					top 65%
					left 75%
					transform scale(0.7)
					animation-delay 800ms
		
				&:nth-child(7)
					top 45%
					left 5%
					transform scale(0.7)
					animation-delay 1s
</style>