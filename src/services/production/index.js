import AV from 'leancloud-storage/live-query'
import store from '@store'
import { formatDate } from '@utils/date'

// 产品列表查询
export const getProductionList = (params = {
  pageSize: 5,
  currentPage: 1
}, queryAll = false) => {
  const query = new AV.Query('Production')
  const queryCount = new AV.Query('Production')
  const { pageSize, currentPage } = params
  const { username } = store.state.global.user

  query.include('productionImg')
  if(!queryAll) {
    query.limit(pageSize)
    query.skip((currentPage - 1) * pageSize)
  }
  
  query.descending('createdAt')

  return query
    .equalTo('username', username)
    .find()
    .then(result => {
      return result.map(item => item.toJSON())
    })
    .then(list => {
      return queryCount
        .count()
        .then(result => {
          const data = {
            list,
            pagination: {
              total: result,
              pageSize,
              currentPage
            }
          }

          return data
        })
    })
}

// 产品尺寸单位查询
export const getUnitList = () => {
  const query = new AV.Query('ProductionSizeUnit')
  return query
    .find()
    .then(result => {
      return result.map(item => item.toJSON())
        .map(({ name: label, value }) => ({ label, value }))
    })
}

// 产品新增
export const addProduction = production => {
  const { username } = store.state.global.user
  const ProductionModel = new AV.Object('Production')
  const {
    productionName,
    supplier,
    productionNo,
    size,
    count,
    buyLink,
    price,
    unit,
    productionImg,
    desc,
    remark
  } = production
  const file = (productionImg || []).map(file => file.constructor !== File ? new AV.File(file.name, file.raw) : new AV.File(file.name, file))
  ProductionModel.set('productionName', productionName)
  ProductionModel.set('productionNo', productionNo)
  ProductionModel.set('supplier', supplier)
  ProductionModel.set('size', size)
  ProductionModel.set('count', count)
  ProductionModel.set('buyLink', buyLink)
  ProductionModel.set('price', price)
  ProductionModel.set('productionImg', file)
  ProductionModel.set('unit', unit)
  ProductionModel.set('desc', desc.split('\n').join('<br />'))
  ProductionModel.set('username', username)
  ProductionModel.set('remark', remark)

  return ProductionModel.save()
}

// 产品修改
export const editProduction = production => {
  const {
    objectId,
    productionImg,
    productionName,
    supplier,
    productionNo,
    size,
    count,
    buyLink,
    price,
    unit,
    desc,
    remark
  } = production
  const query = new AV.Query('Production')
  const ProductionModel = AV.Object.createWithoutData('Production', objectId)

  // 先去查一次，对比产品图片，找出被删除的
  return query
    .get(objectId)
    .then(result => {
      const imgIds = result
        .get('productionImg')
        .map(({ objectId, _id }) => objectId || _id)

      const deleteImgIds = imgIds.filter(item => {
        const index = productionImg.findIndex(_item => _item && _item.objectId === item)
        return index === -1
      })

      ProductionModel.set('productionName', productionName)
      ProductionModel.set('productionImg', productionImg.map(item => {
        return item.objectId ? item : new AV.File(item.name, item.raw)
      }))
      ProductionModel.set('supplier', supplier)
      ProductionModel.set('productionNo', productionNo)
      ProductionModel.set('size', size)
      ProductionModel.set('count', count)
      ProductionModel.set('buyLink', buyLink)
      ProductionModel.set('price', price)
      ProductionModel.set('unit', unit)
      ProductionModel.set('desc', desc.split('\n').join('<br />'))
      ProductionModel.set('remark', remark)

      return ProductionModel
        .save()
        .then(() => {
          const deleteFiles = deleteImgIds.map(item => AV.File.createWithoutData(item))
          AV.Object.destroyAll(deleteFiles)

          return Promise.resolve(true)
        })
    })
}

// 产品删除
export const deleteProduction = ids => {
  const deleteObjList = []
  ids = typeof ids === 'string' ? [ids] : ids
  
  // 查出要删除产品的所有产品图片id
  const query= new AV.Query('Production')
  ids.forEach(item => {
    query.equalTo('_id', item)
  })

  return query
    .find()
    .then(result => {
      return result.map(item => item.toJSON())
    })
    .then(async result => {
      const deleteImgIds = result.reduce((prev, next) => {
        prev.push(...next.productionImg.map(({ objectId }) => objectId))
        return prev
      }, [])
      deleteImgIds.forEach(item => deleteObjList.push(AV.File.createWithoutData(item)))
      result.forEach(({ objectId }) => deleteObjList.push(AV.Object.createWithoutData('Production', objectId)))
      
      return await AV.Object.destroyAll(deleteObjList)
    })
}

// 查询产品详情
export const getProductionDetail = id => {
  const query = new AV.Query('Production')

  return query
    .get(id)
    .then(result => result.toJSON())
}

// 查询产品进销记录
export const getProductionOutInComingList = params => {
  const query = new AV.Query('ProductionOutInComing')
  const queryCount = new AV.Query('ProductionOutInComing')
  const { id, pagination: { pageSize, currentPage } } = params

  query
    .equalTo('productionId', id)
    .limit(pageSize)
    .skip((currentPage - 1) * currentPage)
    .descending('createdAt')

  return queryCount
    .equalTo('productionId', id)
    .count()
    .then(count => {
      return query
        .find()
        .then(result => ({
          list: result.map(item => item.toJSON()),
          pagination: {
            pageSize,
            currentPage,
            total: count
          }
        }))
    })
}

// 删除产品进销记录
export const deleteProductionOutInComing = params => {
  const query = new AV.Query('ProductionOutInComing')
  const { productionId, productionOutInComingId, count, createdAt } = params

  // 先删除进销记录
  const productionOutInComingModel = AV.Object.createWithoutData('ProductionOutInComing', productionOutInComingId)
  
  return productionOutInComingModel
    .destroy()
    .then(() => {
      // 再更新之后时间所有的进销记录
      return query.equalTo('productionId', productionId)
        .greaterThan('createdAt', new Date(createdAt))
        .find()
        .then(result => {
          if(result.length > 0) {
            const list = result.map(item => item.toJSON())
            const ProductionOutInComingModelList = list.map(item => {
              const id = item.objectId
              const query = new AV.Query('ProductionOutInComing')

              return query.get(id)
                .then(result => {
                  const { total } = result.toJSON()
                  const model = AV.Object.createWithoutData('ProductionOutInComing', id)
                  model.set('total', String(Number(total) + count))
                  
                  return model.save()
                })
            })

            return AV.Object.saveAll(ProductionOutInComingModelList)
          }else {
            return Promise.resolve()
          }
        })
        .then(() => {
          const productionModel = AV.Object.createWithoutData('Production', productionId)
          return productionModel
            .increment('count', count)
            .save()
        })
    })
}

// 批量删除产品进销记录
export const batchDeleteProductionOutInComing = params => {
  const query = new AV.Query('ProductionOutInComing')

  return query.equalTo('productionId', params)
    .find()
    .then(result => {
      const list = result.map(item => item.toJSON())
      const ProductionOutInComingList = list.map(({ objectId }) => {
        const model = AV.Object.createWithoutData('ProductionOutInComing', objectId)
        return model.todo.destroy()
      })

      return AV.Object.destroyAll(ProductionOutInComingList)
    })
}

// 产品出入库
export const addProductionOutInComing = params => {
  const { form, productionId } = params
  const { opType, count, remark } = form
  const ProductionOutInComingModel = new AV.Object('ProductionOutInComing')
  const query = new AV.Query('Production')
  ProductionOutInComingModel.set('opType', opType)
  ProductionOutInComingModel.set('count', count)
  ProductionOutInComingModel.set('remark', remark)
  ProductionOutInComingModel.set('productionId', productionId)

  const ProductionModel = AV.Object.createWithoutData('Production', productionId)
  ProductionModel.increment('count', opType === 'IN' ? count : opType === 'OUT' ? Number(`-${count}`) : 0)
  
  return ProductionModel
    .save()
    .then(() => {
      return query.get(productionId)
    })
    .then(result => {
      const count = result.get('count')
      ProductionOutInComingModel.set('total', String(count))

      return ProductionOutInComingModel.save()
    })
}

// 产品进销记录查询(按日聚合)
export const getProductionOutInComingListByDay = params => {
  const query = new AV.Query('ProductionOutInComing')

  return query
    .equalTo('productionId', params)
    .select(['total', 'opType', 'count'])
    .ascending('createdAt')
    .find()
    .then(result => {
      const list = result.map(item => {
        const json = item.toJSON()
        json.total = Number(json.total)

        return json
      })
      const listByDay = list.reduce((prev, next) => {
        // 根据日期聚合
        const { createdAt, total, opType, count } = next
        const index = prev.findIndex(item => item.date === formatDate(new Date(createdAt), 'yyyy-MM-dd'))
        const date = formatDate(new Date(createdAt), 'yyyy-MM-dd')

        if(index === -1) {
          prev.push({
            date,
            total,
            outCount: opType === 'OUT' ? count : 0,
            inCount: opType === 'IN' ? count : 0
          })
        }else {
          prev[index] = {
            date,
            total: Number(prev[index].total) + (opType === 'OUT' ? Number(`-${count}`) : count),
            outCount: opType === 'OUT' ? prev[index].outCount + count : prev[index].outCount,
            inCount: opType === 'IN' ? prev[index].inCount + count : prev[index].inCount
          }
        }

        return prev
      }, [])

      return listByDay
    })
}