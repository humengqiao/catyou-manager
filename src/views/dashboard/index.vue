<template>
	<div class="app-container">
		<div class="sider-container">
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

export default {
	name: 'Dashboard',
	components: {
		SideBar,
		UserInfo
	},
	mounted() {
		this.fetchUserPermissionList()
	},
	methods: {
		...mapActions(['fetchUserPermissionList'])
	},
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

				& >>> .el-menu-vertical-container
					height 100%

				& >>> .el-menu-item [class^="el-icon"]
					margin-top 5px
					font-size 18px !important
		
		.router-content-container
			flex 1
</style>