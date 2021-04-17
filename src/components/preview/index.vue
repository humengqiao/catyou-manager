<template>
	<transition name="img-fade" appear>
		<div
			v-if="visible"
			:data-preview-id="id"
			class="container"
			@click="onHandleClickModal">
			<div class="inner-container">
				<div class="content-container">
					<transition
						v-if="visible"
						appear
						@before-enter="beforeEnter"
						@enter="enter"
						:css="false">
						<div class="preview-container">
							<div
								v-if="visible"
								v-loading="loading"
								class="preview-inner-container"
								@click.stop>
								<img
									v-if="!error"
									class="big-img"
									:src="currentProductionUrl"
									alt="产品图片"
									@load="onHandleLoad"
									@error="onHandleLoadError">
								<img
									v-else
									:src="errorImg"
									alt="加载失败">
								</div>
							<div class="indicator-container">
								<span class="current">{{ index }}</span>
								<span>/</span>
								<span class="total">{{ total }}</span>
							</div>
							<div class="prev-next-container">
								<div
									class="btn prev-btn"
									@click.stop="index > 1 && index--">
									<i class="el-icon-arrow-left"></i>
								</div>
								<div
									class="btn next-btn"
									@click.stop="index < total && index++">
									<i class="el-icon-arrow-right"></i>
								</div>
							</div>
						</div>
					</transition>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
import uuid from 'uuid/v4'

export default {
	name: 'Preview',
	props: {
		position: {
			type: Object,
			default: () => ({})
		},
		size: {
			type: Object,
			default: () => ({})
		},
		url: {
			required: true,
			type: [String, Array],
			default: ''
		},
		visible: {
			required: true,
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			id: uuid(),
			index: 1,
			loading: false,
			error: false,
			errorImg: require('@/assets/images/error-img.png')
		}
	},
	computed: {
		currentProductionUrl() {
			const url = this.url
			const index = this.index
			const urls = typeof url === 'string' ? [url] : [...url]
			// eslint-disable-next-line
			this.loading = true

			return urls[index - 1]
		},
		total() {
			return typeof this.url === 'string' ? 1 : this.url.constructor === Array ? this.url.length : 0
		}
	},
	methods: {
		onHandleClickModal() {
			this.$emit('update:visible', false)
			this.$emit('close')
		},
		onHandleLoad() {
			this.loading = false
			this.error = false
		},
		onHandleLoadError() {
			this.loading = false
			this.error = true
		},
		beforeEnter(el) {
			el.style = `
				position: absolute;
				left: ${this.position.left}px;
				top: ${this.position.top}px;
				width: ${this.size.width}px;
				height: ${this.size.height}px;
			`
		},
		enter(el, done) {
			el.style = `
				position: absolute;
				left: 50%;
				top: 50%;
				width: 40%;
				height: 100%;
				transform: translate3d(-50%, -50%, 0);
			`
			el.addEventListener('transitionend', () => {
				done()
			})
		}
	}
}
</script>

<style lang="stylus" scoped>
	.container
		position fixed
		left 0
		top 0
		right 0
		bottom 0
		z-index 999

		.inner-container
			height 100%
			padding 100px 0
			background rgba(0, 0, 0, .5)

			.content-container
				position relative
				height 100%

				.preview-container
					position relative
					display flex
					flex-direction column
					width 40%
					height 100%
					margin 0 auto

					.preview-inner-container
						display flex
						justify-content center
						align-items center
						flex 1
						height 0
						border-radius 5px
						border 1px solid #ccc
						background #fff
						box-shadow 0 2px 12px 0 rgba(0, 0, 0, .1)

						.big-img
							width 100%
							height 100%

					.indicator-container
						margin-top 5px
						text-align center
						color #fff

						& *
							font-size 16px

						.current
							margin-right 3px

						.total
							margin-left 3px

					.prev-next-container
						.btn
							position absolute
							top 50%
							font-size 50px
							transform translateY(-50%)
							color #fff
							cursor pointer

							& >>> [class^="el-icon"]
								font-size 50px

							&.prev-btn
								left -60px

							&.next-btn
								right -60px
</style>
