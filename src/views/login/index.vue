<template>
	<div
		class="container"
		:style="containerStyle">
		<!-- 特效组件 -->
		<component
			v-if="effectComponent"
			:is="effectComponent"></component>
		<h2 class="system-name">产品进销存管理系统</h2>
		<div class="login-container">
			<el-form
				ref="loginFormRef"
				:model="form"
				:rules="rules"
				label-width="100px">
				<el-form-item
					class="input-item-container"
					label="用户名："
					prop="username">
					<el-input
						:class="['input', {
							shaking: isUsernameError
						}]"
						v-model="form.username"
						placeholder="请输入用户名"
						@animationend.native="isUsernameError = false"></el-input>
				</el-form-item>
				<el-form-item
					class="input-item-container"
					label="密码："
					prop="password">
					<div class="password-input-container">
						<el-input
							:type="ifViewPassword ? 'text' : 'password'"
							:class="['input', {
								shaking: isPasswordError
							}]"
							v-model="form.password"
							placeholder="请输入密码"
							@animationend.native="isPasswordError = false"
							@keyup.native.enter="onHandleClickLogin">
						</el-input>
						<i
							class="el-icon-view eye-btn"
							@click="ifViewPassword = !ifViewPassword"></i>
					</div>
				</el-form-item>
				<div class="login-btn-container">
					<div
						:class="['login-btn', {
							flying: loginLoading,
							circling: isCircling
						}]"
						:style="loginBtnStyle"
						@click="onHandleClickLogin"
						@transitionend="onHandleTransitionEndLoginBtn">
						<span class="login-text">登 录</span>
					</div>
				</div>
			</el-form>
		</div>
	</div>
</template>

<script>
import { mapActions } from 'vuex'
import flyStart from '@components/fly-start'

export default {
	name: 'Login',
	components: {
		flyStart
	},
	data() {
		return {
			loginLoading: false,
			isCircling: false,
			isUsernameError: false,
			isPasswordError: false,
			ifViewPassword: false,
			bgIndex: this.$utils.commonUtils.tweenRandom(1, 2),
			bgEffect: {
				1: 'flyStart'
			},
			form: {
				username: '',
				password: ''
			},
			rules: {
				username: [
					{
						required: true,
						trigger: 'blur'
					}
				],
				password: [
					{
						required: true,
						trigger: 'blur'
					}
				]
			}
		}
	},
	computed: {
		effectComponent() {
			const bgIndex = this.bgIndex
			return this.$themes.loginTheme.loginBgEffectComponent[bgIndex]
		},
		containerStyle() {
			return {
				backgroundImage: `url(${require(`../../assets/images/bg${this.bgIndex}.jpeg`)})`
			}
		},
		loginBtnStyle() {
			const bgIndex = this.bgIndex
			return {
				backgroundImage: this.$themes.loginTheme.loginBtnLinearGradient[bgIndex]
			}
		}
	},
	watch: {
		loginLoading(newVal) {
			if(!newVal) {
				this.isCircling = false
			}
		}
	},
	mounted() {
		this.timer = setInterval(() => {
			this.bgIndex = this.$utils.commonUtils.tweenRandom(1, 2)
		}, 8000)
	},
	destroyed() {
		this.timer && clearInterval(this.timer)
	},
	methods: {
		async onHandleClickLogin() {
			const form = this.form
			if(!form.username || !form.password) {
				if(!form.username) this.isUsernameError = true
				if(!form.password) this.isPasswordError = true
			}

			try {
				const isValid = await this.$refs.loginFormRef.validate()
				if(!isValid) return
				if(this.loginLoading) return

				this.loginLoading = true
				const result = await this.login(form)
				if(result && this.$service.userService.checkServerUserData(result)) {
					return this.$router.push('/')
				}else {
					this.$message.error('登录信息不合法')
				}
			}catch(error) {
				this.loginLoading = false
				if(this.isUsernameError || this.isPasswordError || !error) return
				this.$message.error(error)
			}
		},
		onHandleTransitionEndLoginBtn() {
			const loginLoading = this.loginLoading
			if(loginLoading) {
				this.isCircling = true
			}
		},
		...mapActions(['login'])
	}
}
</script>

<style lang="stylus" scoped>
	.container
		overflow hidden
		height 100%
		background-repeat no-repeat
		background-size cover
		transition background-image .5s

		.system-name
			position relative
			margin-top 100px
			margin-bottom 30px
			font-size 30px
			color #fff
			text-align center
			z-index 100

		.login-container
			position relative
			width 600px
			padding 60px 30px
			margin 0 auto
			border-radius 5px
			box-shadow 0px 2px 10px rgba(0, 0, 0, .3)
			background rgba(255, 255, 255, .3)
			backdrop-filter blur(5px)
			z-index 100

			& >>> .el-form-item__label
				white-space nowrap

			.input-item-container
				& >>> .el-form-item__label
					color #fff

				& >>> .el-form-item__error
					display none
				
				.password-input-container
					position relative

					.eye-btn
						position absolute
						right 60px
						top 50%
						font-size 20px
						transform translateY(-50%)
						cursor pointer

				.input
					width 90%

					@keyframes shaking
						0%
							transform translateX(0px)
						
						50%
							transform translateX(10px)

						100%
							transform translateX(0px)

					&.shaking
						animation shaking .3s ease 3

			.login-btn-container
				display flex
				flex-direction row
				justify-content center
				width 414px
				margin-left 80px

				.login-btn
					position relative
					width 100%
					height 40px
					line-height 40px
					margin 40px 0
					margin-bottom 0
					border-radius 20px
					color #fff
					text-align center
					cursor pointer
					transition width .3s ease, background-image .3s ease
					box-shadow 0px 2px 10px rgba(0, 0, 0, .3)

					&::after
						display none
						content ''
						position absolute
						left 0
						top 0
						right 0
						bottom 0
						border-radius 50%
						background-image inherit

					&.circling
						&::after
							display block
							animation-name scaling
							animation-duration 2s
							animation-timing-function linear
							animation-iteration-count infinite

					.login-text
						position relative
						font-size 16px
						z-index 10

					@keyframes scaling
						0%
							transform scale(1)

						50%
							transform scale(1.3)

						100%
							transform scale(1)

					&.flying
						width 40px
</style>