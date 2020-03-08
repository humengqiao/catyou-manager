<template>
	<div class="container">
		<div class="op-container">
			<el-button
				type="primary"
				size="small"
				@click="() => {
					upcAddOrEditModal = true
					opType = 'add'
				}">新建UPC</el-button>
			<el-button
				type="success"
				size="small"
				:loading="exportUPCListLoading"
				@click="onHandleClickExportUPCExcel">导入UPC Excel</el-button>
		</div>
		<div class="title-container">
			<h3 class="title">UPC列表</h3>
			<div class="total">共<strong style="color: rgb(255, 0, 0);">{{ pagination.total }}</strong>个</div>
		</div>
		<div class="table-container">
			<el-table
				v-loading="upcLoading"
				:data="list"
				border
				stripe
				highlight-current-row
				height="100%"
				class="table">
				<el-table-column
					label="操作"
					fixed
					width="60">
					<template slot-scope="scope">
						<span
							style="color: #579ef8;font-size: 12px;margin-right: 5px;cursor: pointer;"
							@click="onHandleClickEdit(scope.row)">编辑</span>
						<span
							style="color: #e98f8c;font-size: 12px;cursor: pointer;"
							@click="onHandleClickDelete(scope.row)">删除</span>	
					</template>
				</el-table-column>
				<el-table-column
					label="序号"
					width="50">
					<template slot-scope="scope">{{ (pagination.currentPage - 1) * pagination.pageSize + (scope.$index + 1) }}</template>
				</el-table-column>
				<el-table-column
					label="UPC"
					prop="upc"></el-table-column>
				<el-table-column
					label="SKU"
					prop="sku"></el-table-column>
				<el-table-column label="创建时间">
					<template slot-scope="scope">{{ $utils.dateUtils.formatDate(new Date(scope.row.createdAt)) }}</template>
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
			@size-change="fetchUpcList"
			@current-change="fetchUpcList"></el-pagination>
		<!-- upc删除确认框 -->
		<el-dialog
			:visible.sync="deleteUpcModal"
			title="删除UPC"
			width="30%">
			<div>你确定要删除此UPC吗？</div>	
			<span
				slot="footer"
				class="dialog-footer">
				<el-button
					size="small"
					@click="deleteUpcModal = false">取 消</el-button>
				<el-button
					type="primary"
					size="small"
					:loading="deleteUpcLoading"
					@click="onHandleConfirmDeleteUpc">确 定</el-button>
			</span>
		</el-dialog>
		<!-- upc新增(编辑)框 -->
		<el-dialog
			:visible.sync="upcAddOrEditModal"
			:title="upcAddOrEditModalTitle"
			destroy-on-close
			@close="() => form = {upc: '', sku: ''}">
			<el-form
				ref="upcAddorEditFormRef"
				:model="form"
				:rules="rules"
				label-width="100px"
				status-icon>
				<el-form-item
					label="upc："
					prop="upc">
					<el-input
						v-model="form.upc"
						placeholder="请输入upc"></el-input>
				</el-form-item>
				<el-form-item
					label="sku："
					prop="sku">
					<el-input
						v-model="form.sku"
						placeholder="请输入sku"></el-input>
				</el-form-item>
			</el-form>
			<span
				slot="footer"
				class="dialog-footer">
				<el-button
					size="small"
					@click="() => {
						upcAddOrEditModal = false
						form = {
							upc: '',
							sku: ''
						}
					}">取 消</el-button>
				<el-button
					type="primary"
					size="small"
					:loading="addOrEditUpcLoading"
					@click="onHandleConfirmAddOrEditUpc">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
export default {
	name: 'UPC',
	data() {
		return {
			upcLoading: false,
			exportUPCListLoading: false,
			deleteUpcModal: false,
			deleteUpcLoading: false,
			upcAddOrEditModal: false,
			addOrEditUpcLoading: false,
			list: [],
			pagination: {
				currentPage: 1,
				pageSize: 10,
				total: 0
			},
			opType: 'add',
			form: {
				upc: '',
				sku: ''
			},
			rules: {
				upc: [
					{
						required: true,
						message: 'upc不能为空',
						trigger: 'blur'
					}
				]
			}
		}
	},
	computed: {
		upcAddOrEditModalTitle() {
			const opType = this.opType
			if(opType === 'add') {
				return '新增UPC'
			}

			if(opType === 'edit') {
				return '编辑UPC'
			}

			return ''
		}
	},
	mounted() {
		this.fetchUpcList()
	},
	methods: {
		async fetchUpcList() {
			const { currentPage, pageSize } = this.pagination
			const params = {
				currentPage,
				pageSize
			}
			
			this.upcLoading = true

			try {
				const { list, pagination } = await this.$service.upcService.getUpcList(params)
				this.list = [...list]
				this.pagination = { ...pagination }
			}catch(error) {
				this.$message.error(error)
			}finally {
				this.upcLoading = false
			}
		},
		async onHandleClickExportUPCExcel() {
			try {
				const importJsonList = await this.$utils.fileUtils.importExcel(val => {
					this.exportUPCListLoading = val
				})

				const list = importJsonList.map(item => {
					const values = Object.values(item)
					const [ upc, sku = '' ] = values
					return {
						upc: String(upc),
						sku: String(sku)
					}
				})

				const result = await this.$service.upcService.addUpc(list)
				if(result) {
					this.$message.success('导入成功')
					this.pagination = {
						pageSize: 10,
						currentPage: 1,
						total: 0
					}

					this.$nextTick(() => {
						this.fetchUpcList()
					})
				}
			}catch(error) {
				// eslint-disable-next-line
				error = typeof error === 'object' ? error.toString() : error
				this.$message({
					type: 'error',
					message: error,
					duration: 0,
					showClose: true
				})
			}finally {
				this.exportUPCListLoading = false
			}
		},
		onHandleClickEdit(row) {
			const { upc, sku } = row
			this.editUpcItem = row
			this.form = {
				upc,
				sku
			}
			this.upcAddOrEditModal = true
			this.opType = 'edit'
		},
		onHandleClickDelete(row) {
			this.deleteUpcItem = row
			this.deleteUpcModal = true
		},
		async onHandleConfirmDeleteUpc() {
			const deleteUpcItem = this.deleteUpcItem
			if(!deleteUpcItem) return this.$message.error('删除upc错误')
			const id = deleteUpcItem.objectId
			this.deleteUpcLoading = true

			try {
				await this.$service.upcService.deleteUpc(id)
				this.$message.success('删除upc成功')
				this.deleteUpcModal = false
				this.fetchUpcList()
			}catch(error) {
				this.$message.error(error)
			}finally {
				this.deleteUpcLoading = false
			}
		},
		async onHandleConfirmAddOrEditUpc() {
			const valid = await this.$refs.upcAddorEditFormRef.validate()
			if(!valid) return
			const form = this.form
			const opType = this.opType
			this.addOrEditUpcLoading = true

			try {
				if(opType === 'add') {
					await this.$service.upcService.addUpc(form)
				}else if(opType === 'edit') {
					if(!this.editUpcItem) return this.$message.error('upc编辑错误')
					const { objectId } = this.editUpcItem
					form.id = objectId

					await this.$service.upcService.editUpc(form)
				}

				this.$message.success(`${opType === 'add' ? '新增' : opType === 'edit' ? '修改' : ''}upc成功`)
				if(opType === 'add') {
					this.pagination = {
						currentPage: 1,
						pageSize: 10,
						total: 0
					}
				}

				this.upcAddOrEditModal = false
				this.$nextTick(() => {
					this.fetchUpcList()
				})
			}catch(error) {
				this.$message.error(error)
			}finally {
				this.addOrEditUpcLoading = false
			}
		}
	}
}
</script>

<style lang="stylus" scoped>
	.container
		display flex
		flex-direction column
		height 100%
		padding 20px

		& >>> .el-dialog__body
			padding 35px

		& >>> .el-dialog__close
			font-size 20px

		.title-container
			display flex
			flex-direction row
			justify-content space-between
			align-items center
			margin-top 30px

			.title
				font-size 16px !important
			
			.total
				font-size 12px

		.table-container
			flex 1
			height 0

			.table
				border-radius 5px

		.pagination-container
			margin-top 5px
			text-align right
</style>