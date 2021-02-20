import { formatDate } from './date'
import xlsx from 'xlsx'

export const downloadExcel = (htmlStr, filename = formatDate(new Date(), 'yyyy-MM-dd') + '.xls') => {
  const blob = new Blob([htmlStr], {type: 'application/vnd.ms-excel'})
  const el = document.createElement('a')
  const url = URL.createObjectURL(blob)
  el.href = url
  el.download = filename
  el.style.display = 'none'
  document.body.appendChild(el)
  el.click()
  document.body.removeChild(el)
}

// 导入文件
export const importFile = (extensions = []) => {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.onchange = event => {
      const files = event.target.files
      if(files.length === 0) {
        this.$message.error('无可导入的文件')
        return reject('用户取消')
      }

      const file = files[0]
      const regexp = new RegExp(extensions.map(item => item.startsWith('.') ? `(${item})` : `.(${item})`).join('|') + '$')
      if(!regexp.test(file.name)) return this.$message.error('文件格式不正确')

      resolve(file)
    }

    input.style.display = 'none'
    document.body.appendChild(input)
    input.click()
    document.body.removeChild(input)
  })
}

// 导入excel
export const importExcel = async (cb = () => {}) => {
  const file = await importFile(['.xlsx', '.xls'])
  if(!file) return Promise.reject('excel文件导入失败')
  cb(true)

  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = event => {
      try {
        const data = event.target.result
        const workbook = xlsx.read(data, {
          type: 'binary'
				})

				console.log(workbook.Sheets)

        const json = []
        // 遍历每张表读取
        for(let sheet in workbook.Sheets) {
          if (workbook.Sheets.hasOwnProperty(sheet)) {
            json.push(...xlsx.utils.sheet_to_json(workbook.Sheets[sheet]))
            break // 如果只取第一张表，就取消注释这行
          }
        }

        return resolve(json)
      }catch(error) {
        cb(false)
        return reject(error)
      }
    }

    reader.readAsBinaryString(file)
  })
}
