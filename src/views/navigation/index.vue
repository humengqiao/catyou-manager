<template>
	<div class="container">
		<div class="op-container">
			<el-button
				type="primary"
				size="small"
				@click="onHandleClickAddNavigation">新增</el-button>
		</div>
		<div class="list-container">
			<div class="user-navigation-container">
				<title-section
					title="用户导航列表"
					:count="list.length"></title-section>
			</div>
			<div class="table-container">
				<el-table
					v-loading="userNavigationLoading"
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
						label="路由名称"
						prop="name"></el-table-column>
					<el-table-column
						label="路由地址"
						prop="path"></el-table-column>
					<el-table-column
						label="是否在侧边栏展示"
						width="120">
						<template slot-scope="scope">{{ scope.row.show ? '是' : '否' }}</template>
					</el-table-column>
					<el-table-column
						label="图标"
						prop="icon"></el-table-column>
					<el-table-column
						label="是否禁用"
						width="80">
						<template slot-scope="scope">{{ scope.row.disabled ? '是' : '否' }}</template>
					</el-table-column>
					<el-table-column label="更新时间">
						<template slot-scope="scope">{{ $utils.dateUtils.formatDate(new Date(scope.row.updatedAt)) }}</template>
					</el-table-column>
					<el-table-column
						label="操作"
						width="80">
						<template slot-scope="scope">
							<span
								style="color: rgb(87, 158, 248);font-size: 12px;margin-right: 5px;cursor: pointer;"
								@click="onHandleClickEditNavigation(scope.row)">修改</span>
							<span
								style="color: rgb(233, 143, 140);font-size: 12px;cursor: pointer;"
								@click="onHandleClickDeleteNavigation(scope.row)">删除</span>
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
				@size-change="fetchNavigationList"
				@current-change="fetchNavigationList"></el-pagination>
		</div>
		<!-- 导航新增(修改)弹框 -->
		<el-dialog
			class="navigation-add-or-edit-modal"
			:visible.sync="navigationAddOrEditModal"
			:title="navigationAddOrEditTitle"
			destroy-on-close
			@close="onHandleCloseNavigationAddOrEditModal">
			<el-form
				ref="navigationAddOrEditFormRef"
				:model="form"
				:rules="rules"
				label-width="100px"
				status-icon>
				<el-form-item
					label="路由名称："
					prop="name">
					<el-input
						v-model="form.name"
						placeholder="请输入导航名称"></el-input>
				</el-form-item>
				<el-form-item
					label="路由地址："
					prop="path">
					<el-input
						v-model="form.path"
						placeholder="请输入导航地址"></el-input>
				</el-form-item>
				<el-form-item
					label="侧边栏展示："
					prop="show">
					<el-switch
						v-model="form.show"
						active-text="展示"
						inactive-text="不展示"
						@change="val => !val && (form.icon = '')"></el-switch>
				</el-form-item>
				<el-form-item
					v-if="form.show"
					label="导航栏图标："
					prop="icon">
					<el-input
						v-model="form.icon"
						placeholder="请输入导航栏图标类名"></el-input>
				</el-form-item>
				<el-form-item
					label="禁用："
					prop="disabled">
					<el-switch
						v-model="form.disabled"
						active-text="禁用"
						inactive-text="不禁用"></el-switch>
				</el-form-item>
				<el-form-item
					label="备注："
					prop="remark">
					<el-input
						type="textarea"
						v-model="form.remark"
						:rows="3"
						placeholder="请输入备注"></el-input>
				</el-form-item>
			</el-form>
			<span
				slot="footer"
				class="dialog-footer">
				<el-button
					size="small"
					@click="navigationAddOrEditModal = false">取 消</el-button>
				<el-button
					type="primary"
					size="small"
					:loading="navigationAddOrEditLoading"
					@click="onHandleConfirmAddOrEditNavigation">确 定</el-button>
			</span>
		</el-dialog>
		<!-- 删除导航确认框 -->
		<el-dialog
			:visible.sync="navigationDeleteModal"
			title="删除导航"
			width="30%">
			<div>您确定要删除该导航吗</div>
			<span
				slot="footer"
				class="dialog-footer">
				<el-button
					size="small"
					@click="navigationDeleteModal = false">取 消</el-button>
				<el-button
					type="primary"
					size="small"
					:loading="navigationDeleteLoading"
					@click="onHandleConfirmDeleteNavigation">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import TitleSection from '@components/title-section'

export default {
	name: 'Navigation',
	components: {
		TitleSection
	},
	data() {
		return {
			list: [],
			userNavigationLoading: false,
			navigationAddOrEditModal: false,
			navigationAddOrEditLoading: false,
			navigationDeleteModal: false,
			navigationDeleteLoading: false,
			pagination: {
				currentPage: 1,
				pageSize: 10,
				total: 0
			},
			opType: 'add',
			form: {
				name: '',
				path: '',
				show: true,
				icon: '',
				disabled: false,
				remark: ''
			},
			rules: {
				name: [
					{
						required: true,
						message: '导航名称不能为空'
					}
				],
				path: [
					{
						required: true,
						message: '导航地址不能为空'
					}
				]
			}
		}
	},
	computed: {
		navigationAddOrEditTitle() {
			const opType = this.opType

			if(opType === 'add') return '新增导航'
			if(opType === 'edit') return '修改导航'
			return ''
		}
	},
	mounted() {
		this.fetchNavigationList()
	},
	methods: {
		async fetchNavigationList() {
			const pagination = this.pagination
			this.userNavigationLoading = true

			try {
				const result = await this.$service.navigationService.getNavigationList(pagination)
				if(result) {
					const { list, pagination } = result
					this.list = [...list]
					this.pagination = { ...pagination }
				}
			}catch(error) {
				this.$message.error(error)
			}finally {
				this.userNavigationLoading = false
			}
		},
		onHandleClickAddNavigation() {
			this.opType = 'add'
			this.navigationAddOrEditModal = true
		},
		onHandleCloseNavigationAddOrEditModal() {
			this.form = {
				name: '',
				path: '',
				show: true,
				icon: '',
				disabled: false,
				remark: ''
			}
		},
		async onHandleConfirmAddOrEditNavigation() {
			const opType = this.opType
			const form = this.form
			const valid = await this.$refs.navigationAddOrEditFormRef.validate()
			if(!valid) return
			this.navigationAddOrEditLoading = true

			try {
				if(opType === 'add') {
					await this.$service.navigationService.addNavigation(form)
				}

				if(opType === 'edit') {
					await this.$service.navigationService.editNavigation(form)
				}

				this.$message.success(`导航${opType === 'add' ? '新增' : opType === 'edit' ? '修改' : ''}成功`)
				this.navigationAddOrEditModal = false
				this.pagination = {
					currentPage: 1,
					pageSize: 10,
					total: 0
				}

				this.$nextTick(() => {
					this.fetchNavigationList()
				})
			}catch(error) {
				this.$message.error(error)
			}finally {
				this.navigationAddOrEditLoading = false
				if(opType !== 'edit') return

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
		onHandleClickEditNavigation(row) {
			const { name, path, icon, show, disabled, objectId, remark } = row
			this.form = {
				name,
				path,
				icon,
				show,
				disabled,
				remark,
				external: {
					orignalPath: path,
					objectId
				}
			}

			this.opType = 'edit'
			this.navigationAddOrEditModal = true
		},
		onHandleClickDeleteNavigation(row) {
			this.navigationDeleteModal = true
			this.navigationDeleteRow = row
		},
		async onHandleConfirmDeleteNavigation() {
			const row = this.navigationDeleteRow
			if(!row) return this.$message.error('无可删除的导航')

			const { objectId, path } = row
			this.navigationDeleteLoading = true

			try {
				const payload = {
					objectId,
					path
				}

				await this.$service.navigationService.deleteNavigation(payload)
				this.$message.success('导航删除成功')

				this.navigation = {
					currentPage: 1,
					pageSize: 10,
					total: 0
				}

				this.$nextTick(() => {
					this.fetchNavigationList()
				})
			}catch(error) {
				this.$message.error(error)
			}finally {
				this.navigationDeleteLoading = false

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
		}
	},
}
</script>

<style lang="stylus" scoped>
	.container
		display flex
		flex-direction column
		height 100%
		padding 20px

		.bread-item-container
			& >>> .el-breadcrumb__inner
				font-size 16px

		.list-container
			display flex
			flex-direction column
			flex 1

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
		.navigation-add-or-edit-modal
			& >>> .el-dialog__body
				padding 35px

			& >>> .el-dialog__close
				font-size 20px
</style>
