const LS_KEY = 'raspwhere-key'
const UPDATE_CODE_TEMPLATE = 'curl -d "ip=$(hostname -i)&hostname=$(hostname)&fqdn=$(hostname -f)" #serverurl#/api/ping/#key#/'
const key = window.localStorage.getItem(LS_KEY)

let fellowTemplate
let running = true

const fillList = (fellowes) => {
  $('[data-section=fellowes]').empty()

  fellowes.forEach((f) => {
    const now = new Date()

    const ts = new Date(f.tsutc + now.getTimezoneOffset())
    const diff = Math.floor((now.getTime() - ts) / 1000)

    let lastUpdate = diff + ' sec'
    let lastUpdateStatus = 'is-success'
    if (diff > 60) {
      lastUpdate = Math.floor(diff / 60) + ' min'
      lastUpdateStatus = 'is-dark'
    }
    if (diff > 60 * 60) {
      lastUpdate ='> 1 hour'
      lastUpdateStatus = 'is-light'
    }

    let fellow = $(fellowTemplate)
    fellow.find('[data-value=title]').text(f.hostname)
    fellow.find('[data-value=running]').text(lastUpdate)
    fellow.find('[data-element=dish]').addClass(lastUpdateStatus)
    if (f.fqdn) {
      fellow.find('[data-value=fqdn]').text(f.fqdn)
    } else {
      fellow.find('[data-section=fqdn]').remove()
    }
    f.ips.forEach((ip) => {
      fellow.find('[data-value=ips]').append(`<li>${ip}</li>`)
    })

    const date = ts.toLocaleDateString('de-DE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
    const time = ts.toLocaleTimeString()
    fellow.find('[data-value=time]').text(`${date} ${time}`)

    $('[data-section=fellowes]').append(fellow)
  })
}

const refresh = () => {
  if (!running) return

  $.get(`/api/fellowes/${key}`, (data) => {
    if (data.status === 'ok') {
      if (data.fellowes) {
        $('[data-section=nodata]').addClass('is-hidden')
        fillList(data.fellowes)

        setTimeout(refresh, 2 * 1000)
      }
    }
  })
}

const deleteKey = () => {
  running = false

  $.post(`/api/delete-key/${key}`, (data) => {
    window.location.href = '/'
  })
}

$(() => {
  fellowTemplate = $('template[data-template=fellow]').html()

  let updateCode = UPDATE_CODE_TEMPLATE.replace('#serverurl#', document.location.origin)
  updateCode = updateCode.replace('#key#', key)
  $('[data-value=updatecode]').text(updateCode)
  $('[data-btn=deletekey]').click(deleteKey)
  refresh()
})
