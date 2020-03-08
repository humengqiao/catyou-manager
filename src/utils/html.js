export const tableHtmlTemplate = (tableHead, tableBody) => `
  <!DOCTYPE html>
  <html lang="zh-cn">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <title>导出excel</title>
      <style>
        .tableA {
          border-collapse: collapse;
        }
        .tableA .title th {
          height: 50px;
          font-size: 24px;
          font-family: '微软雅黑';
          font-weight: 700;
        }
        .tableA tr th {
          border: 1px #000 solid;
          background: #efefef;
        }
        .tableA tr td {
          padding: 0 60px;
          border: 1px #000 solid;
          text-align: center;
        }
        .tableA .footer td {
          font-size: 20px;
          font-weight: 700;
        }

        img {
          width: 30px;
          height: 30px;
        }
      </style>
    </head>
    <body>
      <table bordercolor="black" class="tableA">
        <thead>${tableHead}</thead>
        <tbody>${tableBody}</tbody>
      </table>
    </body>
  </html>
`

export const getExportHtml = (columnList, list) => {
  const tableHead = `
    <tr>
      <th>序号</th>${
        columnList.reduce((prev, next) => {
          return prev += `<th>${next.name}</th>`
        }, '')
      }
    </tr>
  `
  const tableBody = list.reduce((prev, next, index) => {
    const keys = columnList.map(({ value }) => value)
    const tds = `
      <td>${index + 1}</td>${
        keys.map(item => {
          const tdValue = next[item].constructor === Array ? next[item].join('\n') : next[item]
          if(!tdValue) return

          return `<td>${ tdValue || ''}</td>`
        })
        .filter(item => !!item)
        .join('')
      }
    `

    return prev += `<tr>${tds}</tr>`
  }, '')

  return tableHtmlTemplate(tableHead, tableBody)
}