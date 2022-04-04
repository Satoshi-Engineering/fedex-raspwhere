const LS_KEY = 'raspwhere-key'
const key = window.localStorage.getItem(LS_KEY)
let fellowTemplate

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

$(() => {
  fellowTemplate = $('template[data-template=fellow]').html()

  $.get(`/api/fellowes/${key}`, (data) => {
    if (data.status === 'ok') {
      if (data.fellowes) {
        console.log(data.fellowes)
        $('[data-section=nodata]').addClass('is-hidden')
        fillList(data.fellowes)
      }
    }
  })
})
