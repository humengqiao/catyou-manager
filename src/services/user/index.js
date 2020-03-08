import AV from 'leancloud-storage/live-query'
// eslint-disable-next-line
import storage from 'good-storage'
import store from '@/store'

// 获取用户头像
export const getUserAvatar = params => {
  const query = new AV.Query('_File')
  return query
    .get(params)
    .then(result => result.toJSON())
}

// 获取用户信息
export const getUser = params => {
  const query = new AV.Query('_User')
  return query
    .get(params)
    .then(result => result.toJSON())
    .then(async result => {
      const avatar = await getUserAvatar(result.avatar.objectId)
      const avatarUrl = avatar.url
      delete result.avatar

      return {
        ...result,
        avatarUrl
      }
    })
}

// 用户登录
export const login = params => {
  const { username, password } = params
  return AV.User
    .logIn(username, password)
    .then(result => {
      // 获取用户头像
      const user = result.toJSON()
      if(user.avatar && user.avatar.objectId) {
        const avatarId = user.avatar.objectId
        const query = new AV.Query('_File')

        return query.get(avatarId)
          .then(result => {
            const avatarUrl= result.toJSON().url
            delete user.avatar
          
            return {
              ...user,
              avatarUrl
            }
          })
      }

      return {
        ...user,
        avatarUrl: ''
      }
    })
}

// 更新用户信息
export const updateUser = params => {
  const { key, value } = params
  const userId = store.state.global.user.objectId
  const UserModel = AV.Object.createWithoutData('_User', userId)
  if(params.constructor === Array) {
    params.forEach(({ key, value }) => {
      UserModel.set([key], value)
    })
  }else {
    UserModel.set(key, value)
  }

  return UserModel
    .save()
    .then(result => result.toJSON())
}

// 检查服务端返回的用户信息
export const checkServerUserData = params => {
  return params &&
    params.objectId &&
    params.username
}

// 获取用户权限列表
export const getPermissionList = params => {
  const query = new AV.Query('UserPermission')
  return query.equalTo('username', params)
    .find()
    .then(result => result.map(item => item.toJSON()))
}

// 获取所有用户权限列表
export const getAllPermissionList = params => {
  const { pageSize, currentPage } = params
  const userQuery = new AV.Query('_User')

  return userQuery
    .limit(pageSize)
    .skip((currentPage - 1) * pageSize)
    .descending('createdAt')
    .find()
    .then(result => result.map(item => item.toJSON()))
    .then(result => {
      const permissionQueryList = result.map(({ username }) => {
        const permissionQuery = new AV.Query('UserPermission')

        return permissionQuery.equalTo('username', username)
          .find()
          .then(result => result.map(item => item.toJSON()))
          .then(result => {
            const hadPermissionCount = result.length
            const showPermissionCount = result.filter(item => item.show).length
            const hidePermissionCount = result.filter(item => !item.show).length

            return {
              username,
              hadPermissionCount,
              showPermissionCount,
              hidePermissionCount
            }
          })
      })

      return Promise.all(permissionQueryList)
    })
}

// 清空用户所有权限
export const cleanAllPermission = params => {
  const query = new AV.Query('UserPermission')
  
  return query.equalTo('username', params)
    .find()
    .then(result => result.map(item => item.toJSON()))
    .then(result => {
      const UserPermissionModelList = result.map(({ objectId }) => AV.Object.createWithoutData('UserPermission', objectId).destroy())
      return AV.Object.destroyAll(UserPermissionModelList)
    })
}