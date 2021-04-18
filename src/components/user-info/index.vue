<template>
	<div class="container">
		<div class="inner-container">
			<div class="avatar-container">
				<el-badge
					class="avatar-badge"
					v-if="user && user.isAdmin"
					value="管">
					<img
						class="avatar"
						:src="(user && user.avatarUrl) || defaultAvatar"
						@click="userInfoUpdateModal = true">
				</el-badge>
				<img
					v-else
					class="avatar"
					:src="(user && user.avatarUrl) || defaultAvatar"
					@click="userInfoUpdateModal = true">
			</div>
			<div class="info-container">
				<span>{{ user && user.username }}</span>
				<el-tooltip
					content="注销"
					placement="right">
					<i
						class="logout el-icon-switch-button"
						@click="logoutModal = true"></i>
				</el-tooltip>
			</div>
		</div>
		<!-- 注销弹框 -->
		<el-dialog
			:visible.sync="logoutModal"
			title="注销"
			width="30%">
			<div>您确定要注销吗？</div>
			<span
				slot="footer"
				class="dialog-footer">
				<el-button
					size="small"
					@click="logoutModal = false">取 消</el-button>
				<el-button
					type="primary"
					size="small"
					:loading="logoutLoading"
					@click="onHandleClickLogout">确 定</el-button>
			</span>
		</el-dialog>
		<!-- 资料修改 -->
		<el-drawer
			class="user-info-modal"
			title="资料修改"
			direction="ltr"
			:visible.sync="userInfoUpdateModal">
			<ul class="user-info-list-container">
				<li
					v-loading="avatarLoading"
					class="user-info-item-container">
					<img
						class="avatar in-drawer"
						:src="(user && user.avatarUrl) || defaultAvatar" />
					<span
						class="update-text"
						@click="onHandleUpdateUserAvatar">点击修改</span>
				</li>
				<li class="user-info-item-container">
					<div style="white-space: nowrap;">
						<span style="display: inline-block;width: 60px;">手机号：</span>
						<el-input
							v-model="mobilePhoneNumber"
							size="small"
							style="width: 220px"
							placeholder="请输入手机号"></el-input>
					</div>
					<span
						class="update-text"
						@click="onHandleClickUpdateUserInfo('mobilePhoneNumber')">点击修改</span>
				</li>
				<li class="user-info-item-container">
					<div style="white-space: nowrap;">
						<span style="display: inline-block;width: 60px;">邮箱：</span>
						<el-input
							v-model="email"
							size="small"
							style="width: 220px"
							placeholder="请输入邮箱"></el-input>
					</div>
					<span
						class="update-text"
						@click="onHandleClickUpdateUserInfo('email')">点击修改</span>
				</li>
				<li class="user-info-item-container">
					<div style="position: relative;white-space: nowrap;">
						<span style="display: inline-block;width: 60px;">密码：</span>
						<el-input
							class="password-input"
							:type="passwordVisble ? 'text' : 'password'"
							v-model="password"
							size="small"
							style="width: 220px;"
							placeholder="请输入密码"></el-input>
						<i
							class="el-icon-view password-btn"
							@click="passwordVisble = !passwordVisble"></i>
					</div>
					<span
						class="update-text"
						@click="onHandleClickUpdateUserInfo('password')">点击修改</span>
				</li>
			</ul>
		</el-drawer>
	</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
	name: 'UserInfo',
	data() {
		return {
			logoutModal: false,
			logoutLoading: false,
			avatarLoading: false,
			userInfoUpdateModal: false,
			passwordVisble: false,
			defaultAvatar: require('@/assets/images/default-avatar.png'),
			mobilePhoneNumber: '',
			email: '',
			password: ''
		}
	},
	computed: {
		...mapGetters({
			user: 'userGetter'
		})
	},
	watch: {
		user: {
			immediate: true,
			deep: true,
			handler(newVal) {
				if(newVal && newVal.mobilePhoneNumber) {
					this.mobilePhoneNumber = newVal.mobilePhoneNumber
				}

				if(newVal && newVal.email) {
					this.email = newVal.email
				}
			}
		}
	},
	methods: {
		async onHandleClickLogout() {
			this.logoutLoading = true

			try {
				await this.logout()
				this.$router.push('/login')
				this.logoutModal = false
			}catch(error) {
				this.$message.error(error)
			}finally {
				this.logoutLoading = true
			}
		},
		onHandleUpdateUserAvatar() {
			const el = document.createElement('input')
			el.type = 'file'
			el.style.display = 'none'
			el.onchange = async event => {
				const file = event.target.files[0]
				const uploadFile = new AV.File('avatar', file)

				if(file) {
					this.avatarLoading = true
					await this.updateUser({
						key: 'avatar',
						value: uploadFile
					})

					this.avatarLoading = false
				}
			}
			document.body.appendChild(el)
			el.click()
		},
		async onHandleClickUpdateUserInfo(key) {
			const val = this[key]

			try {
				await this.updateUser({
					key,
					value: val
				})

				await this.logout()

				this.$message.success('资料修改成功，请重新登录')
				this.$router.push('/login')
			}catch(error) {
				this.$message.error(error)
			}
		},
		...mapActions(['logout', 'updateUser'])
	}
}
</script>

<style lang="stylus" scoped>
	.container
		padding 0 10px
		background rgb(84, 92, 100)
		border-right 1px solid #e6e6e6

		.avatar
			display block
			width 100%
			height 100%
			border-radius 50%
			cursor pointer

			&.in-drawer
				width 40px
				height 40px

		.inner-container
			display flex
			flex-direction column
			justify-content center
			align-items center
			padding 10px 0
			padding-top 20px

			.avatar-container
				position relative
				width 50px
				height 50px

				.avatar-badge
					height 100%

					& >>> .el-badge__content
						line-height 15px

					& >>> .el-badge__content.is-fixed
						right 5px

			.info-container
				margin-top 10px
				color #fff
				font-size 12px

				.logout
					margin-left 5px
					font-size 16px
					vertical-align text-top
					cursor pointer

		.user-info-modal
			& >>> .el-drawer__header
				[role="heading"],
				.el-drawer__close-btn > .el-icon-close
					font-size 20px

			.user-info-list-container
				margin 0 30px

				.user-info-item-container
					display flex
					flex-direction row
					justify-content space-between
					align-items center
					padding 10px 0
					border-bottom 1px solid #ccc

					.update-text
						cursor pointer

					.password-btn
						position absolute
						top 50%
						right 10px
						transform translateY(-50%)
						cursor pointer
						font-size 18px

					.password-input
						& >>> .el-input__inner
							padding-right 35px
</style>
