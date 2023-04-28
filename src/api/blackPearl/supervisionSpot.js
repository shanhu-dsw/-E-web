import request from '@/utils/request'

// 单位类型管理 --> 获取单位类型列表
export function getDepartmentTypeListApi(data = {}) {
  return request({
    url: '/supervision-spot/module/supervision.spot.DepartmentType/getDepartmentType',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}
// 单位类型管理 --> 添加单位类型
export function addDepartmentTypeApi(data = {}) {
  return request({
    url: '/supervision-spot/module/supervision.spot.DepartmentType/addDepartmentType',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}
// 单位类型管理 --> 修改单位类型
export function modifyDepartmentTypeApi(data = {}) {
  return request({
    url: '/supervision-spot/module/supervision.spot.DepartmentType/modifyDepartmentType',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

// 单位类型管理 --> 删除单位类型
export function removeDepartmentTypeApi(data = {}) {
  return request({
    url: '/supervision-spot/module/supervision.spot.DepartmentType/removeDepartmentType',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

// 单位管理 --> 获取单位列表
export function getDepartmentApi(data = {}) {
  return request({
    url: '/supervision-spot/module/supervision.spot.Department/getDepartment',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

// 单位管理 --> 添加单位
export function addDepartmentApi(data = {}) {
  return request({
    url: '/supervision-spot/module/supervision.spot.Department/addDepartment',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

// 单位管理 --> 修改单位
export function modifyDepartmentApi(data = {}) {
  return request({
    url: '/supervision-spot/module/supervision.spot.Department/modifyDepartment',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

// 单位管理 --> 删除单位
export function removeDepartmentApi(data = {}) {
  return request({
    url: '/supervision-spot/module/supervision.spot.Department/removeDepartment',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

// 单位管理 --> 设置单位问题分类
export function modifyProblemTypeApi(data = {}) {
  return request({
    url: '/supervision-spot/module/supervision.spot.Department/modifyProblemType',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}
// 个人问题类型管理 --> 获取个人问题类型列表
export function getProblemPersonTypeListApi(data = {}) {
  return request({
    url: '/supervision-spot/module/supervision.spot.ProblemPersonType/getProblemPersonType',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}
// 个人问题类型管理 --> 添加个人问题类型
export function addProblemPersonTypeApi(data = {}) {
  return request({
    url: '/supervision-spot/module/supervision.spot.ProblemPersonType/addProblemPersonType',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}
// 个人问题类型管理 --> 修改个人问题类型
export function modifyProblemPersonTypeApi(data = {}) {
  return request({
    url: '/supervision-spot/module/supervision.spot.ProblemPersonType/modifyProblemPersonType',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

// 个人问题类型管理 --> 删除个人问题类型
export function removeProblemPersonTypeApi(data = {}) {
  return request({
    url: '/supervision-spot/module/supervision.spot.ProblemPersonType/removeProblemPersonType',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

// 单位问题类型管理 --> 获取单位问题类型列表
export function getProblemDepartmentTypeListApi(data = {}) {
  return request({
    url: '/supervision-spot/module/supervision.spot.ProblemDepartmentType/getProblemDepartmentType',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}
// 单位问题类型管理 --> 添加单位问题类型
export function addProblemDepartmentTypeApi(data = {}) {
  return request({
    url: '/supervision-spot/module/supervision.spot.ProblemDepartmentType/addProblemDepartmentType',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}
// 单位问题类型管理 --> 修改单位问题类型
export function modifyProblemDepartmentTypeApi(data = {}) {
  return request({
    url: '/supervision-spot/module/supervision.spot.ProblemDepartmentType/modifyProblemDepartmentType',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

// 单位问题类型管理 --> 删除单位问题类型
export function removeProblemDepartmentTypeApi(data = {}) {
  return request({
    url: '/supervision-spot/module/supervision.spot.ProblemDepartmentType/removeProblemDepartmentType',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

// 系统配置 --> 获取系统配置
export function getSystemConfigApi(data = {}) {
  return request({
    url: '/supervision-spot/module/supervision.spot.SystemConfig/getSystemConfig',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

// 系统配置 --> 修改系统配置
export function modifySystemConfigApi(data = {}) {
  return request({
    url: '/supervision-spot/module/supervision.spot.SystemConfig/modifySystemConfig',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

// 删除失败记录管理 --> 获取文件删除失败记录
export function getStorageFileDeleteFailRecordApi(data = {}) {
  return request({
    url: '/supervision-spot/module/supervision.spot.StorageFileDeleteFailRecord/getStorageFileDeleteFailRecord',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}
// 删除失败记录管理 --> 删除文件删除失败记录
export function removeFileDeleteFailLogApi(data = {}) {
  return request({
    url: '/supervision-spot/module/supervision.spot.StorageFileDeleteFailRecord/removeFileDeleteFailLog',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}
