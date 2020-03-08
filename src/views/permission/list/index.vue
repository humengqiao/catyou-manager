<template>
	<div class="list-container">
		<div class="user-permission-container">
			<title-section
				title="用户权限列表"
				:count="list.length"></title-section>
		</div>
		<div class="table-container">
			<el-table
				v-loading="userPermissionLoading"
				:data="list"
				border
				stripe
				highlight-current-row
				height="100%"
				class="table">
				<el-table-column
					label="序号"
					width="50px">
					<template slot-scope="scope">{{ (pagination.currentPage - 1) * pagination.pageSize + scope.$index + 1 }}</template>
				</el-table-column>
				<el-table-column
					label="用户名"
					prop="username"></el-table-column>
				<el-table-column
					label="已获取的权限数"
					prop="hadPermissionCount"></el-table-column>
				<el-table-column
					label="导航菜单权限数"
					prop="showPermissionCount"></el-table-column>
				<el-table-column
					label="非导航菜单权限数"
					prop="hidePermissionCount"></el-table-column>
				<el-table-column
					label="操作"
					width="100">
					<template slot-scope="scope">
						<span
							style="color: rgb(87, 158, 248);font-size: 12px;margin-right: 5px;cursor: pointer;"
							@click="$router.push(`/dashboard/permission/modify/${scope.row.username}`)">修改</span>
						<span
							style="color: rgb(233, 143, 140);font-size: 12px;cursor: pointer;"
							@click="onHandleOneClickClean(scope.row)">一键清空</span>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<el-pagination
			v-if="list.length > 0"
			class="pagination-container"
      :page-sizes="[10, 20, 30]"
			:current-page.sync="pagination.currentPage"
      :page-size.sync="pagination.pageSize"
      layout="sizes, prev, pager, next"
      :total="pagination.total"
			@size-change="fetchUserPermissionList"
			@current-change="fetchUserPermissionList"></el-pagination>
		<!-- 一键清空权限 -->
		<el-dialog
			:visible.sync="oneClickCleanModal"
			title="清空权限"
			width="30%">
			<div>您确定要清空该用户的所有权限吗？</div>
			<span
				slot="footer"
				class="dialog-footer">
				<el-button
					size="small"
					@click="oneClickCleanModal = false">取 消</el-button>
				<el-button
					type="primary"
					size="small"
					:loading="oneClickCleanLoading"
					@click="onHandleConfirmOnClickClean">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import { mapActions } from 'vuex'
import TitleSection from '@components/title-section'

export default {
	name: 'PermissionList',
	components: {
		TitleSection
	},
	data() {
		return {
			list: [],
			userPermissionLoading: false,
			oneClickCleanModal: false,
			oneClickCleanLoading: false,
			pagination: {
				pageSize: 10,
				currentPage: 1,
				total: 0
			}
		}
	},
	mounted() {
		this.fetchAllUserPermissionList()
		this.setBreadList()
	},
	methods: {
		setBreadList() {
			this.setBread([{
				path: '/dashboard/permission',
				name: '权限管理'
			},
			{
				path: '/dashboard/permission/list',
				name: '列表'
			}])
		},
		async fetchAllUserPermissionList() {
			const pagination = this.pagination
			this.userPermissionLoading = true

			try {
				const list = await this.$service.userService.getAllPermissionList(pagination)
				if(list) {
					this.list = [...list]
				}
			}catch(error) {
				this.$message.error(error)
			}finally {
				this.userPermissionLoading = false
			}
		},
		onHandleOneClickClean(row) {
			this.oneClickCleanModal = true
			this.oneClickCleanData = row
		},
		async onHandleConfirmOnClickClean() {
			const oneClickCleanData = this.oneClickCleanData
			if(!oneClickCleanData) return

			this.oneClickCleanLoading = true
			const username = oneClickCleanData.username
			try {
				await this.$service.userService.cleanAllPermission(username)
				this.$message.success('清空成功')
				this.oneClickCleanModal = false
				this.fetchAllUserPermissionList()
				this.fetchUserPermissionList()
			}catch(error) {
				this.$message.error(error)
			}finally {
				this.oneClickCleanLoading = false
			}
		},
		...mapActions(['fetchUserPermissionList', 'setBread'])
	}
}
</script>

<style lang="stylus" scoped>
	.list-container
		display flex
		flex-direction column
		flex 1
		margin-bottom 30px

		.table-container
			flex 1
			height 0

			.table
				overflow auto
				width 100%
				height 100%
				border-radius 5px

		.pagination-container
			margin-top 5px
			text-align right
</style>