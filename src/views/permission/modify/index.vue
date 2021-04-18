<template>
	<div class="modify-container">
		<title-section title="用户权限配置">
			<divider class="divider"></divider>
		</title-section>
		<div class="modify-content-container">
			<el-transfer
				:titles="['所有权限', '已选权限']"
				filter-placeholder="请输入权限名"
				filterable
				v-model="permissionList"
				:left-default-checked="selectedPermissionList"
				:right-default-checked="selectedPermissionList"
				:data="list"
				:render-content="renderTransferItem"
				target-order="push"
				@right-check-change="selectedPermissionRightChange"
				@change="(_, direction) => (direction === 'left') && (selectedPermissionList = [])">
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
			permissionList: [],
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
					this.list = result.map(({ path, name, objectId, disabled, icon, show, remark }) => ({
						key: objectId,
						label: name,
						value: path,
						navigationDisabled: disabled,
						icon,
						show,
						remark
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
					this.permissionList = result.map(({ objectId }) => objectId)
				}
			}catch(error) {
				this.$message.error(error)
			}
		},
		async onHandleConfirmPermission() {
			let sortIndex = 1
			const list = this.list
			const username = this.$route.params.username
			const selectedPermissionList = this.selectedPermissionList
			const permissionList = selectedPermissionList.map(item => {
				const index = list.findIndex(({ key }) => key === item)

				if(index !== -1) {
					const { value: path, icon, label: name, show, navigationDisabled, remark } = list[index]
					return {
						path,
						icon,
						name,
						show,
						navigationDisabled,
						sort: sortIndex++,
						remark
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
		onClickSortItem(event, key, type) {
			event.stopPropagation()
			event.preventDefault()

			const isUp = /^up$/i.test(type)
			const isDown = /^down$/i.test(type)

			const originalIndex = this.permissionList.findIndex(item => item === key)
			const existSelectedIndex = this.selectedPermissionList.findIndex(item => item === key)

			if(originalIndex !== -1) {
				if(isUp) {
					if(originalIndex === 0) return

					this.permissionList.splice(originalIndex, 1)
					this.permissionList.splice(originalIndex - 1, 0, key)

					const nextIndex = originalIndex - 1
					const nextKey = this.permissionList[nextIndex]
					const existNextKey = this.selectedPermissionList.findIndex(item => item === nextKey) !== -1
					if(!existNextKey) return

					if(existSelectedIndex !== -1) {
						this.selectedPermissionList.splice(existSelectedIndex, 1)
						this.selectedPermissionList.splice(existSelectedIndex - 1, 0, key)
					}
				}

				if(isDown) {
					if(originalIndex === this.permissionList.length - 1) return

					this.permissionList.splice(originalIndex, 1)
					this.permissionList.splice(originalIndex + 1, 0, key)

					const nextIndex = originalIndex + 1
					const nextKey = this.permissionList[nextIndex]
					const existNextKey = this.selectedPermissionList.findIndex(item => item === nextKey) !== -1
					if(!existNextKey) return

					if(existSelectedIndex !== -1) {
						this.selectedPermissionList.splice(existSelectedIndex, 1)
						this.selectedPermissionList.splice(existSelectedIndex + 1, 0, key)
					}
				}
			}
		},
		selectedPermissionChange(currentKeyList, [key]) {
			console.log(currentKeyList, key)
			// const index = currentKeyList.findIndex(item => item === key)

			// if(index !== -1) {
			// 	this.selectedPermissionList.splice(index, 1)
			// }else {
			// 	this.selectedPermissionList.push(key)
			// }
		},
		selectedPermissionRightChange(_, [key]) {
			let selectedPermissionList = this.selectedPermissionList
			const existIndex = selectedPermissionList.findIndex(item => item === key)
			if(existIndex === -1) {
				selectedPermissionList = selectedPermissionList.concat(key)
			}else {
				selectedPermissionList.splice(existIndex, 1)
			}

			// 从permissionList找出选中的同步顺序到selectedPermissionList
			const realSelectedPermissionList = this.permissionList.filter(item => selectedPermissionList.findIndex(_item => _item === item) !== -1)
			this.selectedPermissionList = [...realSelectedPermissionList]
		},
		renderTransferItem(_, { key, label, icon }) {
			// 判断是否为已选中
			const selectedIndex = this.permissionList.findIndex(item => item === key)

			if(selectedIndex !== -1) {
				return (
					<span>
						<span>
							{
								icon && <i class={icon} style="font-size: 14px;margin-right: 5px;"></i>
							}
							<span>{ label }</span>
						</span>
						<span style="float: right;margin-top: 6px;">
							{
								selectedIndex !== 0 ?
									<i
										class="el-icon-top"
										style={{
											fontSize: '16px',
											marginRight: selectedIndex === this.permissionList.length - 1 ? '0' : '5px'
										}}
										onClick={event => this.onClickSortItem(event, key, 'UP')}></i> :
									<i style="margin-right: 5px;"></i>
							}
							{
								selectedIndex !== this.permissionList.length - 1 &&
									<i
										class="el-icon-bottom"
										style="font-size: 16px;"
										onClick={event => this.onClickSortItem(event, key, 'DOWN')}></i>
							}
						</span>
					</span>
				)
			}

			return (
				<span>
					{
						icon && <i class={icon} style="font-size: 14px;margin-right: 5px;"></i>
					}
					<span>{ label }</span>
				</span>
			)
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
			height 0
			padding-top 10px

			& >>> .el-transfer-panel__item
				display block
				margin-right 30px

			& >>> .el-transfer
				display flex
				flex-direction row
				justify-content space-between
				width 100%

			& >>> .el-transfer-panel
				display flex
				flex-direction column
				flex 1
				height auto

			& >>> .el-transfer__buttons
				display flex
				justify-content center
				align-items center

			& >>> .el-transfer__button
				margin-bottom 0

			& >>> .el-transfer-panel__body
				display flex
				flex-direction column
				flex 1
				height 0

			& >>> .el-transfer-panel__list
				overflow-y auto
				flex 1
				height 0

		.btn-container
			margin-top 10px
			text-align right
</style>
