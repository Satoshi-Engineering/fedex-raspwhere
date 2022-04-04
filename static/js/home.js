const LS_KEY = 'raspwhere-key'

const checkKey = () => {
  const key = window.localStorage.getItem(LS_KEY)
  if (key !== null) {
    window.location.replace(`/list/${key}`);
  }
}

$(() => {
  checkKey()

  $('[data-btn=create-key]').click(() => {

    $.post(`/api/create-key`, (data) => {
      if (data.status === 'ok') {
        window.localStorage.setItem(LS_KEY, data.key)
        checkKey()
      }
    })
  })
})
