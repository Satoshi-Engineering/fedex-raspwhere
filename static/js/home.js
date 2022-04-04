const LS_KEY = 'raspwhere-key'

const checkKey = () => {
  const key = window.localStorage.getItem(LS_KEY)

  if (key !== null) {
    $.get(`/api/check-key/${key}`, (data) => {
      if (data.valid === true) {
        $('[data-section=key]').removeClass('is-hidden')
        $('[data-btn=key]').click(() => {
          window.location.replace(`/list/${key}`)
        })
        $('[data-section-key=value]').text(key)
      } else {
        window.localStorage.removeItem(LS_KEY)
      }
    })
  }
}

$(() => {
  checkKey()

  $('[data-btn=create-key]').click(() => {

    $.post(`/api/create-key`, (data) => {
      if (data.status === 'ok') {
        const key = data.key
        window.localStorage.setItem(LS_KEY, key)
        window.location.replace(`/list/${key}`)
      }
    })
  })
})
