<template>
	<div class="container">
		<div class="op-container">
			<el-button
				type="primary"
				size="small"
				@click="() => {
					newProductionModal = true
					opType = 'add'	
				}">新建产品</el-button>
			<!-- <el-button
				type="info"
				size="small">导入产品Excel</el-button> -->
			<el-button
				type="success"
				size="small"
				:loading="exportProductionListLoading"
				@click="onHandleClickExportProductionList">导出产品Excel</el-button>
		</div>
		<title-section
			title="产品列表"
			:count="list.length"></title-section>
		<div class="table-container">
			<el-table
				v-loading="productionLoading"
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
					width="50"
					label="序号">
					<template slot-scope="scope">{{ (pagination.currentPage - 1) * pagination.pageSize + (scope.$index + 1) }}</template>
				</el-table-column>
				<el-table-column
					label="SKU"
					sortable
					min-width="100"
					prop="productionNo"></el-table-column>
				<el-table-column
					label="名称"
					prop="productionName"></el-table-column>
				<el-table-column
					label="采购价(¥)"
					prop="price"
					width="80"></el-table-column>
				<el-table-column
					label="供应商"
					prop="supplier"></el-table-column>
				<el-table-column label="采购链接">
					<template slot-scope="scope">
						<a
							:key="index"
							v-for="(item, index) in scope.row.buyLink"
							:href="item.url | filterLink"
							target="_blank"
							style="display: block;color: #579ef8;">{{ item.name }}</a>
					</template>
				</el-table-column>
				<el-table-column
					label="尺寸"
					min-width="90">
					<template slot-scope="scope">
						<span>{{ scope.row.size }} (<strong>{{ scope.row.unit | filterProductionUnit(productionUnitList) }}</strong>) </span>
					</template>
				</el-table-column>
				<el-table-column
					label="库存"
					prop="count"
					width="60"></el-table-column>
				<el-table-column
					label="进销管理"
					width="110">
					<template slot-scope="scope">
						<span
							class="in-out-comeing-btn"
							@click="onHandleClickView(scope.row)">查看</span>
						<span
							class="in-out-comeing-btn"
							@click="onHandleClickProductionInOutComing(scope.row, 'IN')">入库</span>
						<span
							class="in-out-comeing-btn"
							@click="onHandleClickProductionInOutComing(scope.row, 'OUT')">出库</span>
					</template>
				</el-table-column>
				<el-table-column
					label="图片"
					width="100">
					<template slot-scope="scope">
						<img
							:key="Math.random()"
							v-preview="scope.row.productionImg.map(({ url }) => url)"
							v-if="scope.row.productionImg.length > 0"
							class="production-img"
							:src="scope.row.productionImg[0].url"
							alt="产品图片">
						<span v-else>暂无</span>
					</template>
				</el-table-column>
				<el-table-column
					label="备注"
					prop="remark"></el-table-column>
				<el-table-column
					label="创建时间"
					width="90">
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
			@size-change="fetchProductionList"
			@current-change="fetchProductionList"></el-pagination>
		<!-- 新建(编辑)产品 -->
		<el-dialog
			class="add-edit-production-modal-container"
			:visible.sync="newProductionModal"
			:title="addOrEditProductionTitle"
			destroy-on-close
			@close="onHandleCloseNewProductionModal">
			<el-form
				ref="newProductionFormRef"
				:model="form"
				:rules="rules"
				label-width="100px"
				status-icon>
				<el-form-item
					label="产品货号："
					prop="productionNo">
					<el-input
						v-model="form.productionNo"
						placeholder="请输入产品货号"></el-input>
				</el-form-item>
				<el-form-item
					label="产品名称："
					prop="productionName">
					<el-input
						v-model="form.productionName"
						placeholder="请输入产品名称"></el-input>
				</el-form-item>
				<el-form-item
					label="产品价格："
					prop="price">
					<el-input
						v-model="form.price"
						placeholder="请输入产品价格(¥)"></el-input>
				</el-form-item>
				<el-form-item
					label="产品描述："
					prop="desc">
					<el-input
						v-model="form.desc"
						type="textarea"
						placeholder="请输入产品描述"></el-input>
				</el-form-item>
				<el-form-item
					label="供应商："
					prop="supplier">
					<el-input
						v-model="form.supplier"
						placeholder="请输入供应商"></el-input>
				</el-form-item>
				<el-form-item
					label="采购链接："
					prop="buyLink">
					<div
						class="buy-link-input-container"
						:key="index"
						v-for="(item, index) in form.buyLink">
						<el-input
							class="buy-link-name-input"
							v-model="form.buyLink[index].name"
							placeholder="请输入链接名"></el-input>
						<el-input
							class="buy-link-url-input"
							v-model="form.buyLink[index].url"
							placeholder="请输入链接地址"></el-input>
						<i
							v-if="index === 0"
							class="buy-link-btn el-icon-circle-plus-outline"
							@click="form.buyLink.push({
								name: '',
								url: ''
							})"></i>
						<i
							v-else
							class="buy-link-btn el-icon-remove-outline"
							@click="form.buyLink.splice(index, 1)"></i>
					</div>
				</el-form-item>
				<el-form-item label-width="0">
					<el-form-item
						label="产品尺寸："
						prop="size"
						style="display: inline-block;">
						<el-input
							v-model="form.size"
							style="width: 300px;"
							placeholder="请输入产品尺寸(长*宽*高)"></el-input>
					</el-form-item>
					<el-form-item
						label="尺寸单位："
						prop="unit"
						style="display: inline-block;">
						<el-select
							v-model="form.unit"
							placeholder="请选择尺寸单位"
							style="width: 150px;">
							<el-option
								:key="index"
								:label="item.label"
								:value="item.value"
								v-for="(item, index) in productionUnitList"></el-option>	
						</el-select>
					</el-form-item>
				</el-form-item>
				<el-form-item
					label="产品库存："
					prop="count">
					<el-input
						type="number"
						v-model.number="form.count"
						placeholder="请输入产品库存"></el-input>	
				</el-form-item>
				<el-form-item label="产品图片：">
					<el-upload
						action=""
						multiple
						drag
						list-type="picture-card"
						:auto-upload="false"
						:on-change="onHandleChangeProductionImg"
						:file-list="form.productionImg"
						:on-remove="onHandleRemoveProductionImg">
						<i class="el-icon-plus"></i>
					</el-upload>
				</el-form-item>
				<el-form-item label="产品备注：">
					<el-input
						v-model="form.remark"
						type="textarea"
						placeholder="请输入产品备注"></el-input>
				</el-form-item>
			</el-form>
			<span
				slot="footer"
				class="dialog-footer">
				<el-button
					size="small"
					@click="newProductionModal = false">取 消</el-button>
				<el-button
					type="primary"
					size="small"
					:loading="addProductionLoading"
					@click="onHandleConfirmNewProduction">确 定</el-button>
			</span>
		</el-dialog>
		<!-- 删除产品 -->
		<el-dialog
			:visible.sync="deleteProductionModal"
			title="删除产品"
			width="30%">
			<div>确定要删除该产品吗？</div>
			<span
				slot="footer"
				class="dialog-footer">
				<el-button
					size="small"
					@click="deleteProductionModal = false">取 消</el-button>
				<el-button
					type="primary"
					size="small"
					:loading="deleteProductionLoading"
					@click="onHandleConfirmDeleteProduction">确 定</el-button>
			</span>
		</el-dialog>
		<!-- 删除进销记录 -->
		<el-dialog
			:visible.sync="deleteProductionOutInComingModal"
			title="删除进销记录"
			width="30%">
			<div>确定要删除该进销记录吗？</div>
			<span
				slot="footer"
				class="dialog-footer">
				<el-button
					size="small"
					@click="deleteProductionOutInComingModal = false">取 消</el-button>
				<el-button
					type="primary"
					size="small"
					:loading="deleteProductionOutInComingLoading"
					@click="onHandleConfirmDeleteProductionOutInComing">确 定</el-button>
			</span>
		</el-dialog>
		<!-- 查看产品进销 -->
		<el-dialog
			:visible.sync="productionOutInComingRecordModal"
			title="产品进销记录">
			<div
				v-loading="productionOutInComingRecordLoading"
				class="production-out-in-coming-record-container">
				<div class="production-info-container">
					<title-section title="产品信息">
						<divider class="divider"></divider>
					</title-section>
					<ul>
						<li class="info-container">
							<span>产品名称：</span>
							<span class="content">{{ productionDetail.productionName }}</span>
						</li>
					</ul>
					<title-section title="产品进销记录">
						<divider class="divider"></divider>
					</title-section>
					<div class="out-in-coming-table-container">
						<el-table
							:data="productionOutInComingList"
							stripe
							highlight-current-row
							border>
							<el-table-column
								label="序号"
								width="60"
								type="index"></el-table-column>
							<el-table-column
								label="类型"
								width="70px">
								<template slot-scope="scope">{{ scope.row.opType | filterProductionOutInText }}</template>
							</el-table-column>
							<el-table-column
								label="数量"
								prop="count"
								width="70px"></el-table-column>
							<el-table-column
								label="库存"
								width="70px"
								prop="total"></el-table-column>
							<el-table-column
								label="备注"
								prop="remark"></el-table-column>
							<el-table-column
								label="时间"
								width="160">
								<template slot-scope="scope">{{ $utils.dateUtils.formatDate(new Date(scope.row.createdAt)) }}</template>
							</el-table-column>
							<el-table-column
								label="操作"
								width="60px">
								<template slot-scope="scope">
									<span
										style="color: #e98f8c;font-size: 12px;cursor: pointer;"
										@click="onHandleClickDeleteOutInComing(scope.row)">删除</span>
								</template>
							</el-table-column>
						</el-table>
						<el-pagination
							class="pagination-container"
							:page-sizes="[10, 20, 30]"
							:current-page.sync="productionOutInComingPagination.currentPage"
							:page-size.sync="productionOutInComingPagination.pageSize"
							layout="sizes, prev, pager, next"
							:total="productionOutInComingPagination.total"
							@size-change="fetchProductionOutInComingList()"
							@current-change="fetchProductionOutInComingList"
							v-if="productionOutInComingList.length > 0"></el-pagination>
					</div>
					<title-section title="产品进销统计图">
						<divider class="divider"></divider>
					</title-section>
					<div class="production-out-in-coming-graph-container">
						<div
							ref="productionOutInComingGraphRef"
							class="panel-container"></div>
					</div>
					<title-section title="产品附加信息">
						<divider class="divider"></divider>
					</title-section>
					<ul>
						<li class="info-container">
							<span>产品描述：</span>
							<span
								class="content"
								v-html="productionDetail.desc"></span>
							<el-tooltip content="拷贝">
								<i
									class="el-icon-thumb copy-btn"
									@click="onHandleClickDescCopy"></i>
							</el-tooltip>
						</li>
					</ul>
				</div>
			</div>
		</el-dialog>
		<!-- 产品入库或出库 -->
		<el-dialog
			:visible.sync="productionOutInComingModal"
			:title="`${productionOutInComingTitle}产品`"
			destroy-on-close
			@close="() => {
				productionOutInComingForm = {
					count: 1,
					remark: '',
					opType: ''
				}	
			}">
			<div>
				<el-form
					:rules="rulesOutInComing"
					:model="productionOutInComingForm"
					label-width="120px">
					<el-form-item
						:label="`${productionOutInComingTitle}数量：`"
						prop="count">
						<el-input-number
							v-model.number="productionOutInComingForm.count"
							:min="1"
							:max="productionOutInComingMaxCount"
							:placeholder="`请输入${productionOutInComingTitle}产品数量`"
							style="width: 200px;"></el-input-number>
					</el-form-item>
					<el-form-item
						label="备注："
						prop="remark">
						<el-input
							type="textarea"
							v-model="productionOutInComingForm.remark"
							:placeholder="`请输入${productionOutInComingTitle}产品备注`"
							style="width: 70%;"></el-input>
					</el-form-item>
				</el-form>
			</div>
			<span
				slot="footer"
				class="dialog-footer">
				<el-button
					size="small"
					@click="productionOutInComingModal = false">取 消</el-button>
				<el-button
					type="primary"
					size="small"
					:loading="productionOutInComingLoading"
					@click="onHandleConfirmProductionOutInComing">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
import Divider from '@components/divider'
import TitleSection from '@components/title-section'
import { filterProductionUnit, filterLink } from '@/filters'

export default {
	name: 'GoodsList',
	components: {
		Divider,
		TitleSection
	},
	data() {
		return {
			opType: '',
			list: [],
			newProductionModal: false,
			deleteProductionModal: false,
			productionLoading: false,
			addProductionLoading: false,
			deleteProductionLoading: false,
			productionOutInComingRecordModal: false,
			productionOutInComingRecordLoading: false,
			deleteProductionOutInComingModal: false,
			deleteProductionOutInComingLoading: false,
			productionOutInComingModal: false,
			productionOutInComingLoading: false,
			exportProductionListLoading: false,
			pagination: {
				pageSize: 10,
				currentPage: 1,
				total: 0
			},
			form: {
				productionNo: '',
				productionName: '',
				price: '',
				supplier: '',
				productionImg: [],
				buyLink: [
					{
						name: '',
						url: ''
					}
				],
				size: '',
				unit: '2',
				count: 0,
				desc: '',
				remark: ''
			},
			rules: {
				productionNo: [
					{
						required: true,
						message: '请输入产品货号',
						trigger: 'blur'
					}
				],
				productionName: [
					{
						required: true,
						message: '请输入产品名称',
						trigger: 'blur'
					}
				],
				price: [
					{
						required: true,
						message: '请输入产品价格',
						trigger: 'blur'
					}
				],
				supplier: [
					{
						required: true,
						message: '请输入供应商',
						trigger: 'blur'
					}
				],
				buyLink: [
					{
						validator(_, value, callback) {
							// eslint-disable-next-line
							const isError = value.some(({ url }) => !/(https?:\/\/)?[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/.test(url))
							const isNotEmpty = value.some(({ url }) => !!url)
							if(isNotEmpty && isError) {
								return callback(new Error('请输入正确采购链接地址'))
							}

							return callback()
						},
						trigger: 'blur'
					}
				],
				size: [
					{
						required: true,
						message: '请输入产品尺寸',
						trigger: 'blur'
					},
					{
						validator(_, value, callback) {
							if(!/\d+\*\d+\*\d+/.test(value)) {
								return callback(new Error('请输入正确产品尺寸'))
							}

							return callback()
						},
						trigger: 'blur'
					}
				],
				unit: [
					{
						required: true,
						message: '请选择尺寸单位',
						trigger: 'change'
					}
				],
				count: [
					{
						required: true,
						message: '请输入产品库存',
						trigger: 'blur'
					},
					{
						validator(_, value, callback) {
							if(value < 0) {
								return callback(new Error('产品库存不能小于0'))
							}

							return callback()
						},
						trigger: 'blur'
					}
				]
			},
			rulesOutInComing: {
				count: [
					{
						required: true,
						message: '请输入出入库的产品数量',
						trigger: 'blur'
					}
				]
			},
			productionDetail: {
				productionName: '',
				desc: ''
			},
			productionOutInComingList: [],
			productionOutInComingPagination: {
				pageSize: 10,
				currentPage: 1,
				total: 0
			},
			productionOutInComingForm: {
				count: 1,
				remark: '',
				opType: ''
			},
			productionOutInComingOpType: '',
			productionOutInComingMaxCount: 0
		}
	},
	computed: {
		addOrEditProductionTitle() {
			const opType = this.opType

			if(opType === 'add') {
				return '新增产品'
			}

			if(opType === 'edit') {
				return '编辑产品'
			}

			return ''
		},
		productionOutInComingTitle() {
			const productionOutInComingOpType = this.productionOutInComingOpType
			if(productionOutInComingOpType === 'IN') {
				return '入库'
			}

			if(productionOutInComingOpType === 'OUT') {
				return '出库'
			}

			return ''
		},
		...mapGetters({
			productionUnitList: 'productionUnitListGetter'
		})
	},
	mounted() {
		this.fetchProductionList()
	},
	methods: {
		async fetchProductionList() {
			this.productionLoading = true

			try {
				const paginationPayload = this.pagination
				const result = await this.$service.productionService.getProductionList(paginationPayload)
				const { list, pagination } = result
				this.list = [...list]
				this.pagination = { ...pagination }
			}catch(error) {
				this.$message.error(error)
			}finally {
				this.productionLoading = false
			}
		},
		async fetchProductionOutInComingList() {
			const productionOutInComingPagination = this.productionOutInComingPagination
			const id = this.productionDetailId

			const params = {
				id,
				pagination: {
					...productionOutInComingPagination
				}
			}

			// 查询产品进销记录
			const result = await this.$service.productionService.getProductionOutInComingList(params)
			if(result) {
				const { list, pagination } = result
				this.productionOutInComingList = [...list]
				this.productionOutInComingPagination = { ...pagination }
			}
		},
		onHandleChangeProductionImg(_, fileList) {
			this.form.productionImg = [
				...fileList
			]
		},
		async onHandleConfirmNewProduction() {
			const form = this.form
			const opType = this.opType

			const valid = await this.$refs.newProductionFormRef.validate()
			if(!valid) return

			if(opType === 'add') {
				try {
					this.addProductionLoading = true
					const result = await this.$service.productionService.addProduction(form)
					if(result) {
						this.newProductionModal = false
						this.fetchProductionList()
						this.$message.success('产品新增成功')
					}
				}catch(error) {
					this.$message.error(error)
				}finally {
					this.addProductionLoading = false
				}
			}

			if(opType === 'edit') {
				try {
					this.addProductionLoading = true
					const result = await this.$service.productionService.editProduction(form)
					if(result) {
						this.newProductionModal = false
						this.fetchProductionList()
						this.$message.success('产品修改成功')
					}
				}catch(error) {
					this.$message.error(error)
				}finally {
					this.addProductionLoading = false
				}
			}
		},
		onHandleClickDelete({ objectId }) {
			this.deleteProductionId = objectId
			this.deleteProductionModal = true
		},
		async onHandleConfirmDeleteProduction() {
			const id = this.deleteProductionId
			if(!id || id.length === 0) {
				return this.$message.error('产品id缺少')
			}

			this.deleteProductionLoading = true
			try {
				await this.$service.productionService.deleteProduction(id)
				this.$service.productionService.batchDeleteProductionOutInComing(id)

				this.$message.success('删除产品成功')
				this.pagination = {
					pageSize: 10,
					currentPage: 1,
					total: 0
				}

				this.$nextTick(() => {
					this.fetchProductionList()
				})
			}catch(error) {
				this.$message.error(error)
			}finally {
				this.deleteProductionModal = false
				this.deleteProductionLoading = false
			}
		},
		onHandleCloseNewProductionModal() {
			this.form = {
				productionName: '',
				productionNo: '',
				buyLink: [
					{
						name: '',
						url: ''
					}
				],
				count: 0,
				desc: '',
				price: '',
				productionImg: [],
				size: '',
				supplier: '',
				unit: '',
				remark: ''
			}
		},
		onHandleClickEdit(row) {
			this.opType = 'edit'
			this.newProductionModal = true
			const {
				productionName,
				productionNo,
				buyLink,
				count,
				desc,
				objectId,
				price,
				productionImg,
				size,
				supplier,
				unit,
				remark
			} = JSON.parse(JSON.stringify(row))

			this.$nextTick(() => {
				this.form = {
					productionName,
					productionNo,
					buyLink,
					count,
					desc: desc.replace(/<br\s?\/>/g, '\n'),
					objectId,
					price,
					productionImg,
					size,
					supplier,
					unit,
					remark
				}
			})
		},
		onHandleRemoveProductionImg(file) {
			const { uid } = file
			const { productionImg } = this.form
			const index = productionImg.findIndex(item => item.uid === uid)

			if(index !== -1) {
				this.form.productionImg.splice(index, 1)
			}
		},
		async onHandleClickView({ objectId }) {
			this.productionOutInComingRecordModal = true
			this.productionOutInComingRecordLoading = true
			this.productionDetailId = objectId

			try {
				// 查询产品详情
				const result = await this.$service.productionService.getProductionDetail(objectId)
				if(!result) return this.$message.error('查询产品详情失败')

				const { productionName, desc } = result
				this.productionDetail = {
					productionName,
					desc
				}
				
				this.fetchProductionOutInComingList(objectId)
				this.fetchProductionOutInComingGraphList(objectId)
			}catch(error) {
				this.$message.error(error)
			}finally {
				this.productionOutInComingRecordLoading = false
			}
		},
		async fetchProductionOutInComingGraphList(id) {
			try {
				const result = await this.$service.productionService.getProductionOutInComingListByDay(id)
				if(result) {
					const dateList = result.map(({ date }) => date)
					const totalList = result.map(({ total }) => total)
					const outList = result.map(({ outCount }) => outCount)
					const inList = result.map(({ inCount }) => inCount)
					this.renderProductionOutInComingGraph({
						dateList,
						totalList,
						outList,
						inList
					})
				}
			}catch(error) {
				this.$message.error(error)
			}
		},
		renderProductionOutInComingGraph({ dateList, totalList, outList, inList }) {
			console.log(totalList)
			this.chart && this.chart.clear()
			this.chart && this.chart.dispose()
			const chart = this.$echarts.init(this.$refs.productionOutInComingGraphRef)

			chart.setOption({
				title: {
					show: false
				},
				legend: {
					data: [
						{
							name: '库存',
							textStyle: {
								color: '#ff0000'
							}
						},
						{
							name: '入库',
							textStyle: {
								color: 'orange'
							}
						},
						{
							name: '出库',
							textStyle: {
								color: 'navy'
							}
						}
					]
				},
				tooltip: {
					trigger: 'axis'
				},
				xAxis: {
					type: 'category',
					data: dateList,
					axisLabel: {
						interval: 0,
						rotate: 45
					}
				},
				yAxis: {
					type: 'value'
				},
				series: [
					{
						name: '库存',
						type: 'line',
						data: totalList
					},
					{
						name: '入库',
						type: 'line',
						data: inList
					},
					{
						name: '出库',
						type: 'line',
						data: outList
					}
				]
			})

			this.chart = chart
		},
		onHandleClickDescCopy() {
			const { desc } = this.productionDetail
			if(!desc) return this.$message.warning('无拷贝内容')

			const copyStr = desc.replace(/<br\s*\/?>/g, '\r\n')
			this.$utils.commonUtils.copy(copyStr)
			this.$message.success('拷贝成功')
		},
		onHandleClickDeleteOutInComing(row) {
			this.deleteProductionOutInComingModal = true
			this.deleteProductionOutInComing = row
		},
		async onHandleConfirmDeleteProductionOutInComing() {
			const { objectId: id, opType, count, createdAt } = this.deleteProductionOutInComing
			const productionId = this.productionDetailId
			if(!id) return this.$message.warning('无该进销记录id')
			this.deleteProductionOutInComingLoading = true

			try {
				const params = {
					productionId,
					productionOutInComingId: id,
					count: opType === 'IN' ? Number(`-${count}`) : opType === 'OUT' ? count : 0,
					createdAt
				}

				await this.$service.productionService.deleteProductionOutInComing(params)
				this.productionOutInComingPagination = {
					pageSize: 10,
					currentPage: 1,
					total: 0
				}

				this.$nextTick(() => {
					this.fetchProductionOutInComingList()
					this.fetchProductionList()
					this.fetchProductionOutInComingGraphList(productionId)
				})
			}catch(error) {
				this.$message.error(error)
			}finally {
				this.deleteProductionOutInComingModal = false
				this.deleteProductionOutInComingLoading = false
			}
		},
		onHandleClickProductionInOutComing({ objectId, count }, opType) {
			this.productionOutInComingModal = true
			this.productionDetailId = objectId
			this.productionOutInComingOpType = opType
			this.productionOutInComingMaxCount = opType === 'OUT' ? Number(count) : Infinity
			this.productionOutInComingForm.opType = opType
		},
		async onHandleConfirmProductionOutInComing() {
			const form = this.productionOutInComingForm
			const productionDetailId = this.productionDetailId
			const params = {
				form,
				productionId: productionDetailId
			}
			this.productionOutInComingLoading = true

			try {
				const result = await this.$service.productionService.addProductionOutInComing(params)
				if(result) {
					this.productionOutInComingModal = false
					this.fetchProductionList()
					this.$message.success(`${this.productionOutInComingTitle}产品成功`)
				}
			}catch(error) {
				this.$message.error(error)
			}finally {
				this.productionOutInComingLoading = false
			}
		},
		async onHandleClickExportProductionList() {
			this.exportProductionListLoading = true

			try {
				const result = await this.$service.productionService.getProductionList({}, true)
				if(result) {
					const { list } = result
					const exportColumnList = [
						{
							name: 'SKU',
							value: 'productionNo'
						},
						{
							name: '名称',
							value: 'productionName'
						},
						{
							name: '采购价',
							value: 'price'
						},
						{
							name: '供应商',
							value: 'supplier'
						},
						{
							name: '采购链接',
							value: 'buyLink'
						},
						{
							name: '尺寸',
							value: 'size'
						},
						{
							name: '库存',
							value: 'count'
						},
						{
							name: '创建时间',
							value: 'createdAt'
						}
					]
					const productionUnitList = this.productionUnitList
					const exportHtml = this.$utils.htmlUtils.getExportHtml(exportColumnList, list.map(item => ({
						...item,
						price: `${item.price}¥`,
						buyLink: item.buyLink.map(item => `<a href="${filterLink(item.url)}" target="_blank">${item.name}</a>`),
						createdAt: this.$utils.dateUtils.formatDate(new Date(item.createdAt)),
						size: `${item.size}(${filterProductionUnit(item.unit, productionUnitList)})`
					})))
					
					this.$utils.fileUtils.downloadExcel(exportHtml, `产品列表-${this.$utils.dateUtils.formatDate(new Date(), 'yyyy-MM-dd')}.xls`)
				}
			}catch(error) {
				this.$message.error(error)
			}finally {
				this.exportProductionListLoading = false
			}
		}
	},
	filters: {
		filterProductionOutInText(opType) {
			if(opType === 'IN') {
				return '入库'
			}

			if(opType === 'OUT') {
				return '出库'
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

				.production-img
					max-width 100%
					max-height 80px
					cursor pointer
					border-radius 3px

				.in-out-comeing-btn
					color #579ef8
					margin-right 5px
					font-size 12px
					cursor pointer
			
		& >>> .el-dialog__body
			padding 35px

			.el-upload-dragger
				width 100%
				height 100%

		& >>> .el-dialog__close
			font-size 20px

	.pagination-container
		margin-top 5px
		text-align right

	.buy-link-input-container
		display flex
		flex-direction row
		justify-content space-between
		position relative
		margin-bottom 10px

		.buy-link-name-input
			width 130px
			margin-right 10px

		.buy-link-url-input
			flex 1

		.buy-link-btn
			position absolute
			right -25px
			top 50%
			transform translateY(-50%)
			font-size 20px !important
			cursor pointer

	.production-out-in-coming-record-container
		margin-top -20px

		.title-container
			display flex
			flex-direction row
			margin-top 0

			& > h3
				font-size 16px

			.divider
				flex 1
				margin-left 10px
				margin-right 10px

		.info-container
			position relative
			display flex
			flex-direction row
			line-height 1.5

			.content
				flex 1

			.copy-btn
				position absolute
				right 0
				top 0
				cursor pointer

	.add-edit-production-modal-container
		& >>> .el-upload--picture-card i
			font-size 28px !important

		& >>> .el-select__caret
			font-size 14px !important

		& >>> .el-upload-dragger .el-icon-plus
			position absolute
			top 50%
			left 50%
			transform translate3d(-50%, -50%, 0)

	.production-out-in-coming-graph-container
		.panel-container
			height 300px
</style>