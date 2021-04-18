<template>
	<div class="app-container">
		<div class="sider-container">
			<brand-logo></brand-logo>
			<user-info></user-info>
			<side-bar class="sider-bar-container"></side-bar>
		</div>
		<div class="router-content-container">
			<router-view></router-view>
		</div>
	</div>
</template>

<script>
import { mapActions } from 'vuex'
import UserInfo from '@components/user-info'
import SideBar from '@components/side-bar'
import BrandLogo from '@components/brand-logo'

export default {
	name: 'Dashboard',
	components: {
		SideBar,
		UserInfo,
		BrandLogo
	},
	beforeRouteEnter(to, from, next) {
		next(vm => {
			if(from.path !== '/login') {
				vm.fetchUserPermissionList()
			}
		})
	},
	methods: {
		...mapActions(['fetchUserPermissionList'])
	}
}
</script>

<style lang="stylus" scoped>
	.app-container
		display flex
		flex-direction row
		height 100%

		.sider-container
			display flex
			flex-direction column
			height 100%

			.sider-bar-container
				flex 1
				height 0

				& >>> .el-menu-vertical-container
					overflow-y auto
					height 100%

				& >>> .el-menu-item [class^="el-icon"]
					font-size 18px !important

		.router-content-container
			flex 1
</style>
