import AV from 'leancloud-storage/live-query'

// 获取导航列表
export const getNavigationList = params => {
  const { currentPage, pageSize } = params
  const query = new AV.Query('PermissionList')
  const countQuery = new AV.Query('PermissionList')
  
  return countQuery.count()
    .then(count => {
      return query.limit(pageSize)
        .skip((currentPage - 1) * pageSize)
        .find()
        .then(result => result.map(item => item.toJSON()))
        .then(result => ({
          list: result,
          pagination: {
            currentPage,
            pageSize,
            total: count
          }
        }))
    })
}

// 新增导航
export const addNavigation = params => {
  const PermissionModel = new AV.Object('PermissionList')
  const {
    name,
    path,
    show,
    icon,
    disabled
  } = params

  PermissionModel.set('name', name)
  PermissionModel.set('path', path)
  PermissionModel.set('show', show)
  PermissionModel.set('icon', icon)
  PermissionModel.set('disabled', disabled)

  return PermissionModel.save()
}

// 修改导航
export const editNavigation = params => {
  const {
    name,
    path,
    show,
    icon,
    disabled,
    external: {
      orignalPath,
      objectId
    }
  } = params

  // 先去修改PermissonList
  const model = AV.Object.createWithoutData('PermissionList', objectId)
  model.set('name', name)
  model.set('path', path)
  model.set('show', show)
  model.set('icon', icon)
  model.set('disabled', disabled)

  return model.save()
    .then(() => {
      // 再去更新UserPermission
      const query = new AV.Query('UserPermission')

      return query.equalTo('path', orignalPath)
        .find()
        .then(result => {
          result = result.map(item => {
            item.set('name', name)
            item.set('path', path)
            item.set('show', show)
            item.set('icon', icon)
            item.set('disabled', disabled)

            return item
          })

          return AV.Object.saveAll(result)
        })
    })
}

// 删除导航
export const deleteNavigation = params => {
  const { objectId, path } = params
  const model = AV.Object.createWithoutData('PermissionList', objectId)

  return model.destroy()
    .then(() => {
      const query = new AV.Query('UserPermission')

      return query.equalTo('path', path)
        .find()
    })
    .then(result => {
      result = result.map(item => {
        return item.destroy()
      })

      return AV.Object.destroyAll(result)
    })
}