// 获取所有权限列表
export const getAllPermissionList = () => {
  const query = new AV.Query('PermissionList')

  return query.find()
    .then(result => result.map(item => item.toJSON()))
}

// 获取用户所选的权限
export const getUserSelectedPermissionList = params => {
  const query = new AV.Query('UserPermission')
  // 先去查询当前用户所有权限，再去查询对应权限id

  return query.equalTo('username', params)
		.select(['path', 'sort'])
		.ascending('sort')
		.find()
    .then(result => result.map(item => item.toJSON()))
    .then(result => {
      const permissionQueryList = result.map(({ path, sort }) => {
        const query = new AV.Query('PermissionList')
        return query.equalTo('path', path)
          .first()
          .then(result => result && {...result.toJSON(), sort})
      })

      return Promise.all(permissionQueryList)
				.then(result => result.filter(item => !!item))
    })
}

// 修改用户所选的权限
export const updateUserPermission = params => {
  const { username, list } = params
  const query = new AV.Query('UserPermission')

  // 先去查出当前用户之前的所有权限
  return query.equalTo('username', username)
    .select(['path'])
    .find()
    .then(result => result.map(item => item.toJSON()))
    .then(result => {
      // 计算出变化的权限
      const modifyPermission = list.filter(item => result.findIndex(_item => (_item.sort === item.sort) && (_item.path === item.path)) === -1)
      // 计算出删除的权限
      const deletePermission = result.filter(item => list.findIndex(_item => (_item.sort === item.sort) && (_item.path === item.path)) === -1)

      const modifyPremissionModelList = modifyPermission.map(({ path, name, icon, show, navigationDisabled, sort, remark }) => {
        const model = new AV.Object('UserPermission')

        model.set('path', path)
        model.set('name', name)
        model.set('icon', icon)
        model.set('show', show)
        model.set('username', username)
				model.set('disabled', navigationDisabled)
				model.set('sort', sort)
				model.set('remark', remark)

        return model.save()
			})

      const deletePermissionModelList = deletePermission.map(({ objectId }) => {
        const model = AV.Object.createWithoutData('UserPermission', objectId)
        return model.destroy()
          .then(() => Promise.resolve())
      })

      return Promise.all([
        AV.Object.saveAll(modifyPremissionModelList),
        AV.Object.destroyAll(deletePermissionModelList)
      ])
    })
}
