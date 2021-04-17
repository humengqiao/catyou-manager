// 获取fba发货列表
export const getFbaList = params => {
	const { currentPage, pageSize } = params
	const query = new AV.Query('Fba')
	const countQuery = new AV.Query('Fba')

	return countQuery.count()
		.then(count => {
			return query.limit(pageSize)
			.skip((currentPage - 1) * pageSize )
			.find()
			.then(result => result.map(item => item.toJSON()))
			.then(result => ({
				list: [...result],
				pagination: {
					currentPage,
					pageSize,
					total: count
				}
			}))
		})
}

// 新增fba发货
export const addFba = params => {
	const FbaModel = new AV.Object('Fba')
	const {
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
	} = params

	FbaModel.set('time', time)
	FbaModel.set('sku', sku)
	FbaModel.set('fnSku', fnSku)
	FbaModel.set('name', name)
	FbaModel.set('count', count)
	FbaModel.set('singleWeight', singleWeight)
	FbaModel.set('weightKg', weightKg)
	FbaModel.set('singleVolume', singleVolume)
	FbaModel.set('volumeWeight', volumeWeight)
	FbaModel.set('singlePostFee', singlePostFee)
	FbaModel.set('totalPostFee', totalPostFee)
	FbaModel.set('buySingleFee', buySingleFee)
	FbaModel.set('buyTotalFee', buyTotalFee)

	return FbaModel.save()
}

// 编辑fba发货
export const editFba = params => {
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
	} = params

	const model = AV.Object.createWithoutData('Fba', objectId)
	model.set('time', time)
	model.set('sku', sku)
	model.set('fnSku', fnSku)
	model.set('name', name)
	model.set('count', count)
	model.set('singleWeight', singleWeight)
	model.set('weightKg', weightKg)
	model.set('singleVolume', singleVolume)
	model.set('volumeWeight', volumeWeight)
	model.set('singlePostFee', singlePostFee)
	model.set('totalPostFee', totalPostFee)
	model.set('buySingleFee', buySingleFee)
	model.set('buyTotalFee', buyTotalFee)

	return model.save()
}

// 删除fba发货
export const deleteFba = params => {
	const model = AV.Object.createWithoutData('Fba', params)
	return model.destroy()
}
