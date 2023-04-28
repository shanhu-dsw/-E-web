import request from '@/utils/request'

// 菜单管理 --> 获取菜单
export function getMenuListApi(data = {}) {
  return request({
    url: '/supervision-spot/module/security.Menu/getMenu',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

// 菜单管理 --> 添加菜单
export function addMenuApi(data = {}) {
  return request({
    url: '/supervision-spot/module/security.Menu/addMenu',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

// 菜单管理 --> 修改菜单
export function modifyMenuApi(data = {}) {
  return request({
    url: '/supervision-spot/module/security.Menu/modifyMenu',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

// 菜单管理 --> 删除菜单
export function removeMenuApi(data = {}) {
  return request({
    url: '/supervision-spot/module/security.Menu/removeMenu',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

// 角色管理 --> 获取角色
export function getRoleListApi(data = {}) {
  return request({
    url: '/supervision-spot/module/security.Role/getRole',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

// 角色管理 --> 添加角色
export function addRoleApi(data = {}) {
  return request({
    url: '/supervision-spot/module/security.Role/addRole',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

// 角色管理 --> 编辑角色
export function modifyRoleApi(data = {}) {
  return request({
    url: '/supervision-spot/module/security.Role/modifyRoleInfo',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

// 角色管理 --> 删除角色
export function removeRoleApi(data = {}) {
  return request({
    url: '/supervision-spot/module/security.Role/removeRole',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}
// 角色管理 --> 分配菜单
export function modifyRoleMenuApi(data = {}) {
  return request({
    url: '/supervision-spot/module/security.Role/modifyRoleMenu',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

// 获取模块方法
export function getModuleMethodApi(data = {}) {
  return request({
    url: '/supervision-spot/module/security.ModuleMethod/getModuleMethod',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

// 角色管理 --> 分配权限
export function modifyRolePermissionApi(data = {}) {
  return request({
    url: '/supervision-spot/module/security.Role/modifyRolePermission',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

// 管理员管理 --> 获取管理员
export function getAdminUserListApi(data = {}) {
  return request({
    url: '/supervision-spot/module/supervision.spot.AdminInfo/getAdmin',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

// 管理员管理 --> 添加管理员
export function addAdminUserApi(data = {}) {
  return request({
    url: '/supervision-spot/module/supervision.spot.AdminInfo/addAdmin',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

// 管理员管理 --> 修改管理员
export function modifyAdminUserApi(data = {}) {
  return request({
    url: '/supervision-spot/module/supervision.spot.AdminInfo/modifyAdmin',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

// 管理员管理 --> 删除管理员
export function removeAdminUserApi(data = {}) {
  return request({
    url: '/supervision-spot/module/supervision.spot.AdminInfo/removeAdmin',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}
