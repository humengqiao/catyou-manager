<template>
	<div class="modify-container">
		<title-section title="用户权限配置">
			<divider class="divider"></divider>
		</title-section>
		<div class="modify-content-container">
			<el-transfer
				:titles="['所有权限', '已选权限']"
				filter-placeholder="请输入用户名"
				v-model="selectedPermissionList"
				:left-default-checked="selectedPermissionList"
				:right-default-checked="selectedPermissionList"
				@right-check-change="keys => selectedPermissionList = keys"
				:data="list">
			</el-transfer>
		</div>
		<div class="btn-container">
			<el-button
				type="danger"
				@click="$router.back()">返回</el-button>
			<el-button
				type="primary"
				:loading="permissionModifyLoading"
				@click="onHandleConfirmPermission">保存</el-button>
		</div>
	</div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import TitleSection from '@components/title-section'
import Divider from '@components/divider'

export default {
	name: 'PermissionModify',
	components: {
		TitleSection,
		Divider
	},
	data() {
		return {
			list: [],
			selectedPermissionList: [],
			permissionModifyLoading: false
		}
	},
	computed: {
		...mapGetters({
			user: 'userGetter'
		})
	},
	mounted() {
		this.setBreadList()
		this.fetchAllPermissionList()
		this.fetchSelectedPermissioList()
	},
	methods: {
		async fetchAllPermissionList() {
			this.permissionLoading = true

			try {
				const result = await this.$service.permissionService.getAllPermissionList()
				if(result) {
					this.list = result.map(({ path, name, objectId, disabled, icon, show }) => ({
						key: objectId,
						label: name,
						value: path,
						navigationDisabled: disabled,
						icon,
						show
					}))
				}
			}catch(error) {
				this.$message.error(error)
			}finally {
				this.permissionLoading = false
			}
		},
		async fetchSelectedPermissioList() {
			const username = this.$route.params.username

			try {
				const result = await this.$service.permissionService.getUserSelectedPermissionList(username)
				if(result) {
					this.selectedPermissionList = result.map(({ objectId }) => objectId)
				}
			}catch(error) {
				this.$message.error(error)
			}
		},
		async onHandleConfirmPermission() {
			const list = this.list
			const username = this.$route.params.username
			const selectedPermissionList = this.selectedPermissionList
			const permissionList = selectedPermissionList.map(item => {
				const index = list.findIndex(({ key }) => key === item)
				
				if(index !== -1) {
					const { value: path, icon, label: name, show, navigationDisabled } = list[index]
					return {
						path,
						icon,
						name,
						show,
						navigationDisabled
					}
				}
			}).filter(item => !!item)
			this.permissionModifyLoading = true
			const payload = {
				username,
				list: permissionList
			}

			try {
				await this.$service.permissionService.updateUserPermission(payload)
				this.$message.success('用户权限修改成功')
				// this.fetchAllPermissionList()
				// this.fetchSelectedPermissioList()
				// this.fetchUserPermissionList()
			}catch(error) {
				this.$message.error(error)
			}finally {
				this.permissionModifyLoading = false
				// 如果修改权限的用户不是当前用户则刷新页面
				if(username !== this.user.username) return

				this.$notify({
					title: '提示',
					message: '即将刷新页面...',
					type: 'warning',
					duration: 2000
				})
				
				setTimeout(() => {
					window.location.reload()
				}, 2000)
			}
		},
		setBreadList() {
			this.setBread([{
				path: '/dashboard/permission',
				name: '权限管理'
			},
			{
				path: '/dashboard/permission/modify',
				name: '修改'
			}])
		},
		...mapActions(['setBread', 'fetchUserPermissionList'])
	}
}
</script>

<style lang="stylus" scoped>
	.modify-container
		display flex
		flex-direction column
		flex 1
		height 0

		.divider
			flex 1
			margin-left 10px

		.modify-content-container
			display flex
			flex-direction row
			justify-content space-between
			flex 1
			padding-top 10px

			& >>> .el-transfer
				display flex
				flex-direction row
				justify-content space-between
				width 100%

			& >>> .el-transfer-panel
				flex 1

			& >>> .el-transfer__buttons
				display flex
				justify-content center
				align-items center
			
			& >>> .el-transfer__button
				margin-bottom 0

		.btn-container
			margin-top 10px
			text-align right
</style>