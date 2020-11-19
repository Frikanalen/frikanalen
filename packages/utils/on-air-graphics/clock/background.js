const pattern = trianglify({
    width: window.innerWidth,
    height: window.innerHeight,
    xColors: 'YlGn',
    cellSize: 60
  })
  document.body.style.background = 'url(' + pattern.toCanvas().toDataURL() + ')'
