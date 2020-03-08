<template>
	<div class="container">
		<div class="op-container">
			<el-button
				type="primary"
				size="small"
				@click="addOrEditFbaModal = true">新建发货明细</el-button>
		</div>
		<title-section
			title="FBA发货明细列表"
			:count="list.length"></title-section>
		<div class="table-container">
			<el-table
				v-loading="fbaLoading"
				:data="list"
				border
				stripe
				highlight-current-row
				height="100%"
				class="table">
				<el-table-column
					label="序号"
					type="index"
					width="50px">
					<template slot-scope="scope">{{ (pagination.currentPage - 1) * pagination.pageSize + scope.$index + 1 }}</template>
				</el-table-column>
				<el-table-column
					label="操作"
					fixed
					width="60px">
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
					label="时间"
					prop="time"></el-table-column>
				<el-table-column
					label="SKU"
					prop="sku"></el-table-column>
				<el-table-column
					label="FNSKU"
					prop="fnSku"></el-table-column>
				<el-table-column
					label="Name"
					prop="name"></el-table-column>
				<el-table-column
					label="数量"
					prop="count"></el-table-column>
				<el-table-column
					label="单个实重"
					prop="singleWeight"></el-table-column>
				<el-table-column
					label="总量KG"
					prop="weightKg"></el-table-column>
				<el-table-column
					label="单个体积"
					prop="singleVolume"></el-table-column>
				<el-table-column
					label="体积重"
					prop="volumeWeight"></el-table-column>
				<el-table-column
					label="单个运费"
					prop="singlePostFee"></el-table-column>
				<el-table-column
					label="总运费"
					prop="totalPostFee"></el-table-column>
				<el-table-column
					label="采购单价"
					prop="buySingleFee"></el-table-column>
				<el-table-column
					label="采购总价"
					prop="buyTotalFee"></el-table-column>
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
			@size-change="fetchFbaList"
			@current-change="fetchFbaList"></el-pagination>
		<!-- 新建(编辑)fba发货 -->
		<el-dialog
			class="add-or-edit-fba-modal"
			:visible.sync="addOrEditFbaModal"
			:title="addOrEditFbaTitle"
			@close="onHandleCloseAddOrEditFbaModal">
			<el-form
				ref="addOrEditFbaFormRef"
				:model="form"
				label-width="90px">
				<el-form-item
					label="时间："
					prop="time">
					<el-input
						v-model="form.time"
						placeholder="请输入时间内容"></el-input>
				</el-form-item>
				<el-form-item
					label="SKU："
					prop="sku">
					<el-input
						v-model="form.sku"
						placeholder="请输入sku"></el-input>
				</el-form-item>
				<el-form-item
					label="FNSKU："
					prop="fnSku">
					<el-input
						v-model="form.fnSku"
						placeholder="请输入fnSku"></el-input>
				</el-form-item>
				<el-form-item
					label="Name："
					prop="name">
					<el-input
						v-model="form.name"
						placeholder="请输入名称"></el-input>
				</el-form-item>
				<el-form-item
					label="数量："
					prop="count">
					<el-input
						v-model.number="form.count"
						placeholder="请输入数量"></el-input>
				</el-form-item>
				<el-form-item
					label="单个实重："
					prop="singleWeight">
					<el-input
						v-model="form.singleWeight"
						placeholder="请输入单个实重"></el-input>
				</el-form-item>
				<el-form-item
					label="实重KG："
					prop="weightKg">
					<el-input
						v-model="form.weightKg"
						placeholder="请输入实重KG"></el-input>
				</el-form-item>
				<el-form-item
					label="单个体积："
					prop="singleVolume">
					<el-input
						v-model="form.singleVolume"
						placeholder="请输入单个体积"></el-input>
				</el-form-item>
				<el-form-item
					label="体积重："
					prop="volumeWeight">
					<el-input
						v-model="form.volumeWeight"
						placeholder="请输入体积重"></el-input>
				</el-form-item>
				<el-form-item
					label="单个运费："
					prop="singlePostFee">
					<el-input
						v-model="form.singlePostFee"
						placeholder="请输入单个费用"></el-input>
				</el-form-item>
				<el-form-item
					label="总运费："
					prop="totalPostFee">
					<el-input
						v-model="form.totalPostFee"
						placeholder="请输入总运费"></el-input>
				</el-form-item>
				<el-form-item
					label="采购单价："
					prop="buySingleFee">
					<el-input
						v-model="form.buySingleFee"
						placeholder="请输入采购单价"></el-input>
				</el-form-item>
				<el-form-item
					label="采购总价："
					prop="buyTotalFee">
					<el-input
						v-model="form.buyTotalFee"
						placeholder="请输入采购总价"></el-input>
				</el-form-item>
			</el-form>
			<span
				slot="footer"
				class="dialog-footer">
				<el-button
					size="small"
					@click="addOrEditFbaModal = false">取 消</el-button>
				<el-button
					type="primary"
					size="small"
					:loading="addOrEditFbaLoading"
					@click="onHandleConfirmAddOrEditFbaModal">确 定</el-button>
			</span>
		</el-dialog>
		<!-- fba发货删除确认弹框 -->
		<el-dialog
			:visible.sync="deleteFbaModal"
			title="删除fba发货"
			width="30%">
			<div>确定要删除fba发货吗？</div>
			<span
				slot="footer"
				class="dialog-footer">
				<el-button
					size="small"
					@click="deleteFbaModal = false">取 消</el-button>
				<el-button
					type="primary"
					size="small"
					:loading="deleteFbaLoading"
					@click="onHandleConfirmDeleteFba">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import TitleSection from '@components/title-section'

export default {
	name: 'FBA-post-detail',
	components: {
		TitleSection
	},
	data() {
		return {
			list: [],
			fbaLoading: false,
			addOrEditFbaModal: false,
			deleteFbaModal: false,
			opType: 'add',
			form: {
				time: '',
				sku: '',
				fnSku: '',
				name: '',
				count: 0,
				singleWeight: '',
				weightKg: '',
				singleVolume: '',
				volumeWeight: '',
				singlePostFee: '',
				totalPostFee: '',
				buySingleFee: '',
				buyTotalFee: ''
			},
			pagination: {
				currentPage: 1,
				pageSize: 10,
				total: 0
			},
			addOrEditFbaLoading: false,
			deleteFbaLoading: false
		}
	},
	computed: {
		addOrEditFbaTitle() {
			const opType = this.opType

			if(opType === 'add') {
				return '新建FBA发货'
			}

			if(opType === 'edit') {
				return '修改FBA发货'
			}

			return ''
		}
	},
	mounted() {
		this.fetchFbaList()
	},
	methods: {
		async fetchFbaList() {
			const pagination = this.pagination
			this.fbaLoading = true

			try {
				const result = await this.$service.fbaService.getFbaList(pagination)
				if(result) {
					const { list, pagination } = result
					this.list = [...list]
					this.pagination = { ...pagination }
				}
			}catch(error) {
				this.$message.error(error)
			}finally {
				this.fbaLoading = false
			}
		},
		onHandleCloseAddOrEditFbaModal() {
			this.form = {
				time: '',
				sku: '',
				fnSku: '',
				name: '',
				count: 0,
				singleWeight: '',
				weightKg: '',
				singleVolume: '',
				volumeWeight: '',
				singlePostFee: '',
				totalPostFee: '',
				buySingleFee: '',
				buyTotalFee: ''
			}
		},
		async onHandleConfirmAddOrEditFbaModal() {
			try {
				const valid = await this.$refs.addOrEditFbaFormRef.validate()
				if(!valid) return

				const opType = this.opType
				this.addOrEditFbaLoading = true
				const form = this.form

				if(opType === 'add') {
					await this.$service.fbaService.addFba(form)
				}

				if(opType === 'edit') {
					await this.$service.fbaService.editFba(form)
				}

				this.$message.success(`fba发货${opType === 'add' ? '新增' : '修改'}成功`)
				this.addOrEditFbaModal = false
				this.addOrEditFbaLoading = false
				this.fetchFbaList()
			}catch(error) {
				console.log(error)
				this.$message.error(error)
			}
		},
		onHandleClickEdit(row) {
			this.addOrEditFbaModal = true
			this.opType = 'edit'
			const {
				objectId,
				time,
				sku,
				fnSku,
				name,
				count,
				singleWeight,
				weightKg,
				singleVolume,
				volumeWeight,
				singlePostFee,
				totalPostFee,
				buySingleFee,
				buyTotalFee
			} = row

			this.form = {
				objectId,
				time,
				sku,
				fnSku,
				name,
				count,
				singleWeight,
				weightKg,
				singleVolume,
				volumeWeight,
				singlePostFee,
				totalPostFee,
				buySingleFee,
				buyTotalFee
			}
		},
		onHandleClickDelete(row) {
			this.deleteFbaData = row
			this.deleteFbaModal = true
		},
		async onHandleConfirmDeleteFba() {
			this.deleteFbaLoading = true

			const { objectId } = this.deleteFbaData
			if(!objectId) return

			try {
				await this.$service.fbaService.deleteFba(objectId)
				this.$message.success('删除fba发货成功')
				this.deleteFbaModal = false
				this.pagination = {
					pageSize: 10,
					currentPage: 1,
					total: 0
				}

				this.$nextTick(() => {
					this.fetchFbaList()
				})
			}catch(error) {
				this.$message.error(error)
			}finally {
				this.deleteFbaLoading = false
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

	.table-container
		flex 1
		height 0

		.table
			overflow auto
			width 100%
			height 100%
			border-radius 5px

	.add-or-edit-fba-modal
		& >>> .el-dialog__body
			padding 35px

		& >>> .el-icon-close
			font-size 20px

	.pagination-container
		text-align right
</style>
