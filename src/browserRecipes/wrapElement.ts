const wrapElement = (toWrap, wrapper) => {
  wrapper = wrapper || document.createElement('div')
  toWrap.parentNode.replaceChild(wrapper, toWrap)
  return wrapper.appendChild(toWrap)
}

const image = document.querySelector('img')
const wrapper = document.createElement('div')
wrapper.id = 'skull'

wrapElement(image, wrapper)
