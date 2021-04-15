<template>
	<div class="container">
		<!-- 背景图 -->
		<transition-group
			tag="ul"
			name="fade">
			<li
				v-for="(item, index) in bgImgList"
				v-show="index === (bgIndex - 1)"
				:key="item"
				class="bg-img"
				:style="{
					backgroundImage: `url(${item})`
				}"></li>
		</transition-group>
		<!-- 特效组件 -->
		<component
			v-if="effectComponent"
			:is="effectComponent"></component>
		<div class="title-wrapper-box">
			<h2 class="system-name">Cat You Manager</h2>
			<img
				class="cat-img"
				:src="`${publicPath}favicon.ico`">
		</div>
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
						:class="['input', `login-input-hover-${bgIndex}`, {
							shaking: isUsernameError
						}]"
						v-model="form.username"
						placeholder="请输入用户名"
						@animationend.native="isUsernameError = false"></el-input>
				</el-form-item>
				<el-form-item
					class="input-item-container password"
					label="密码："
					prop="password">
					<div class="password-input-container">
						<el-input
							:type="ifViewPassword ? 'text' : 'password'"
							:class="['input', `login-input-hover-${bgIndex}`, {
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
				<div class="operator-btn-box">
					<span
						class="reset-password-btn"
						@click="isShowResetPasswordModal = !isShowResetPasswordModal">忘记密码？</span>
				</div>
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
		<!-- 重置密码弹框 -->
		<el-dialog
			class="reset-password-modal"
			title="重置密码"
			width="35%"
			:visible.sync="isShowResetPasswordModal">
			<el-alert
				title="输入电子邮箱地址收到邮件后去邮件里的链接网站完成重置操作"
				type="warning"></el-alert>
			<el-form
				ref="resetPasswordFormRef"
				:model="resetPasswordModel"
				:rules="resetPasswordFormRules">
				<el-form-item
					prop="email"
					class="form-item-box"
					label="电子邮箱: "
					required>
					<el-input
						v-model="resetPasswordModel.email"
						placeholder="请输入"></el-input>
				</el-form-item>
			</el-form>
			<div class="btn-box">
				<el-button
					type="danger"
					@click="isShowResetPasswordModal = false">取消</el-button>
				<el-button
					type="primary"
					@click="onHandleClickSubmitResetPasswordForm">确定</el-button>
			</div>
		</el-dialog>
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
			},
			isShowResetPasswordModal: false,
			resetPasswordModel: {
				email: ''
			},
			resetPasswordFormRules: {
				email: [
					{
						required: true, message: '请输入电子邮箱', trigger: 'blur'
					},
					{
						validator: (rule, value, callback) => {
							if(!value) return callback(new Error('电子邮箱不能为空'))
							if(!/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value)) return callback(new Error('电子邮箱格式不正确'))

							return callback()
						}, trigger: 'blur'
					}
				]
			},
			bgImgList: [
				require('@/assets/images/bg1.jpeg'),
				require('@/assets/images/bg2.jpeg')
			],
			publicPath: process.env.VUE_BUILD_TARGET === 'gh-pages' ? '/production-manager' : '/'
		}
	},
	computed: {
		effectComponent() {
			const bgIndex = this.bgIndex
			return this.$themes.loginTheme.loginBgEffectComponent[bgIndex]
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
		onHandleClickSubmitResetPasswordForm() {
			this.$refs.resetPasswordFormRef.validate(async valid => {
				if(!valid) return

				try {
					const email = this.resetPasswordModel.email
					await this.$service.userService.resetPasswordByEmail(email)
					this.$message.success('邮件发送成功')
					this.isShowResetPasswordModal = false
				}catch(error) {
					this.$message.error(error)
				}
			})
		},
		...mapActions(['login'])
	}
}
</script>

<style lang="stylus" scoped>
	.container
		overflow hidden
		height 100%

		.bg-img
			position fixed
			left 0
			top 0
			right 0
			bottom 0
			background-repeat no-repeat
			background-size cover
			background-position center

		.title-wrapper-box
			display flex
			flex-direction row
			justify-content center
			align-items center
			margin-top 100px
			margin-bottom 30px

			.system-name
				position relative
				margin 0
				font-size 30px
				color #fff
				text-align center
				z-index 100

			.cat-img
				position relative
				width 60px
				margin-left 10px
				border-radius 6px
				z-index 999

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

				&.password
					margin-bottom 0

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

			.operator-btn-box
				display flex
				flex-direction row
				justify-content flex-end
				margin 0 40px
				color #fff

				.reset-password-btn
					cursor pointer

					&:hover
						text-decoration underline

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
					transition width .3s ease, background-image .3s ease, box-shadow .3s ease
					box-shadow 0px 2px 10px rgba(0, 0, 0, .3)

					&:hover
						box-shadow 0px 2px 10px rgba(0, 0, 0, .5)

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

		.reset-password-modal
			& >>> .el-dialog__close
				font-size 18px

			& >>> .el-dialog__body
				padding-top 5px

			.form-item-box
				display: flex;
				flex-direction: row;
				align-items: center;
				margin-top: 10px;

				& >>> .el-form-item__content
					flex: 1;

			.btn-box
				display flex
				flex-direction row
				justify-content center
				align-items center
				margin-top 20px
</style>
