export const filterProductionUnit = (unit, unitList) => {
  const index = unitList.findIndex(item => item.value === unit)

  if(index !== -1) {
    return unitList[index].label
  }
}

export const filterLink = url => {
  const reg = /^https?:\/\//
  if(!reg.test(url)) return `http://${url}`

  return url
}

export default Vue => {
  Vue.filter('filterProductionUnit', filterProductionUnit)
  Vue.filter('filterLink', filterLink)
}