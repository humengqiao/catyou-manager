export const formatDate = (date, formatStr = 'yyyy-MM-dd HH:mm:ss') => {
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'H+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'S+': date.getMilliseconds()
  }
  //因为date.getFullYear()出来的结果是number类型的,所以为了让结果变成字符串型，下面有两种方法：
  if(/(y+)/.test(formatStr)) {
    //第一种：利用字符串连接符“+”给date.getFullYear()+""，加一个空字符串便可以将number类型转换成字符串。
    formatStr = formatStr.replace(RegExp.$1,(date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for(let k in o){
    if(new RegExp('(' + k + ')').test(formatStr)) {
      //第二种：使用String()类型进行强制数据类型转换String(date.getFullYear())，这种更容易理解。
      formatStr = formatStr.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(String(o[k]).length)))
    }
  }

  return formatStr
}