import AV from 'leancloud-storage/live-query'
import store from '@store'

// 查询upc是否存在
export const checkUpcExist = (params, equalKey = '') => {
  const queryList = params.map(item => {
    const query = new AV.Query('Upc')
    query.equalTo(equalKey, item[equalKey])

    return query
  })

  return AV.Query
    .or(...queryList)
    .find()
    .then(result => {
      if(result.filter(item => !!item).length > 0) {
        const list = result
          .filter(item => !!item)
          .map(item => item.toJSON())
        
        return list
      }
    })
}

// 新增upc
export const addUpc = params => {
  params = params.constructor !== Array ? [params] : params
  
  // 查询upc是否存在
  return checkUpcExist(params, 'upc')
    .then(result => {
      /* 两种情况
        1. result值不为空，表示存在记录，此时需要判断如果是存在，则判断upc对应的sku值是否为空，为空则去修改，不为空则不作处理
        2. result值为空，则直接新增
      */
      const { username } = store.state.global.user
      const models = params.map(({ upc, sku }) => {
        const UpcModel = new AV.Object('Upc')

        if(result && result.length > 0) {
          const { objectId, sku: oldSku } = (result.find(item => item.upc === upc) || {})
          if(objectId) {
            if(!oldSku) {
              const model = AV.Object.createWithoutData('Upc', objectId)
              model.set('sku', sku)
              return model
            }

            return
          }else {
            UpcModel.set('upc', upc)
            UpcModel.set('sku', sku)
            UpcModel.set('username', username)

            return UpcModel
          }
        }

        UpcModel.set('upc', upc)
        UpcModel.set('sku', sku)
        UpcModel.set('username', username)

        return UpcModel
      }).filter(item => !!item)

      return AV.Object.saveAll(models)
    })
}

// 获取upc列表
export const getUpcList = (params = {
  pageSize: 5,
  currentPage: 1
}) => {
  const queryCount = new AV.Query('Upc')
  const query = new AV.Query('Upc')
  const { pageSize, currentPage } = params
  const { username } = store.state.global.user

  return queryCount.count()
    .then(total => {
      return query
      .equalTo('username', username)
      .limit(pageSize)
      .skip((currentPage - 1) * pageSize)
      .select(['upc', 'sku'])
      .descending('createdAt')
      .find()
      .then(result => result.map(item => item.toJSON()))
      .then(result => {
        return {
          list: [...result],
          pagination: {
            currentPage,
            pageSize,
            total
          }
        }
      })
    })
}

// 删除upc
export const deleteUpc = params => {
  const upcModel = AV.Object.createWithoutData('Upc', params)
  return upcModel.destroy()
}

// 编辑upc
export const editUpc = params => {
  const { id, upc, sku } = params
  const upcModel = AV.Object.createWithoutData('Upc', id)
  upcModel.set('upc', upc)
  upcModel.set('sku', sku)

  return upcModel.save()
}