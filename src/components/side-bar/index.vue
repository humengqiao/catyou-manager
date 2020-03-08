<template>
	<div class="container">
		<el-menu
      class="el-menu-vertical-container"
      background-color="#545c64"
      text-color="#fff"
			:default-active="activedMenuIndex"
      active-text-color="#ffd04b"
			router>
			<el-menu-item
				:key="item.objectId"
				:index="item.path"
				:disabled="item.disabled"
				v-for="item in permissionList.filter(item => item.show)">
				<template slot="title">
					<i
						v-if="item.icon"
						:class="[item.icon]"></i>
					<span
						v-else
						class="pad"></span>
					<span class="nav-text">{{ item.name }}</span>
				</template>
			</el-menu-item>
		</el-menu>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
	name: 'SideBar',
	computed: {
		activedMenuIndex() {
			const path = this.$route.path
			// eslint-disable-next-line
			if(/^\/dashboard\/[^\\/]+$/.test(path)) return path

			path.match(/(\/dashboard\/[^\\/]+)/)
			return RegExp.$1
		},
		...mapGetters({
			permissionList: 'permissionListGetter'
		})
	},
	watch: {
		permissionList: {
			deep: true,
			immediate: true,
			handler(newVal) {
				if(/^\/dashboard\/?$/.test(this.$route.path) && newVal && newVal.length > 0) {
					const firstRoutePath = !newVal[0].path.startsWith('/') ?
						`/${newVal[0].path}` :
						newVal[0].path

					this.$router.push(firstRoutePath)
				}
			}
		}
	}
}
</script>

<style lang="stylus" scoped>
	.container
		height 100%

		.el-menu-vertical-container
			width 200px

			.pad
				display inline-block
				width 29px

			.nav-text
				vertical-align sub
</style>