const occlusionClassName = 'sr--occlusion-wrapper'
const occlusionCss = `
.${occlusionClassName} {
  display: inline-block;
  position: relative;
}

.${occlusionClassName} > * {
  display: block;

  max-width: 100%
  height: auto;
  margin-left: auto;
  margin-right: auto;
}

.${occlusionClassName} > img {
  position: relative;
  z-index: 3;
}

.${occlusionClassName} > svg {
  position: absolute;
  z-index: 4;
  top: 0;

  user-select: none;
}`

const toSvgShape = function(
  [shapeName, shapeDims /*, descriptionText */],
  pa,
  scalingFactorX,
  scalingFactorY,
) {
  const randomid = String(Math.random()).slice(2)

  const svgShape = document.createElementNS('http://www.w3.org/2000/svg',
    shapeName === 'arrow' || shapeName === 'darrow' || shapeName === 'line'
      ? 'polyline'
      : shapeName)

  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs')
  const scalingFactorMedian = (scalingFactorX + scalingFactorY) / 2

  svgShape.setAttribute('fill', pa.getProp(['fill']))
  svgShape.setAttribute('fill-opacity', pa.getProp(['fillOpacity']))

  svgShape.setAttribute('stroke', pa.getProp(['stroke']))
  svgShape.setAttribute('stroke-width', pa.getProp(['strokeWidth']) * scalingFactorMedian)
  svgShape.setAttribute('stroke-opacity', pa.getProp(['strokeOpacity']))

  if (pa.getProp(['display']) === 'none') {
    svgShape.setAttribute('display', 'none')
  }

  else {
    switch (shapeName) {
      case 'rect':
        svgShape.setAttribute('x', shapeDims[0] * scalingFactorX)
        svgShape.setAttribute('y', shapeDims[1] * scalingFactorY)
        svgShape.setAttribute('width', shapeDims[2] * scalingFactorX)
        svgShape.setAttribute('height', (shapeDims[3] || shapeDims[2]) * scalingFactorY)
        svgShape.setAttribute('rx', (shapeDims[4] || 0) * scalingFactorX)
        svgShape.setAttribute('ry', (shapeDims[5] || shapeDims[4] || 0) * scalingFactorY)
        break

      case 'ellipse':
        svgShape.setAttribute('cx', (shapeDims[0] * scalingFactorX) + (shapeDims[2] * scalingFactorX / 2))
        svgShape.setAttribute('cy', (shapeDims[1] * scalingFactorY) + (shapeDims[3] * scalingFactorY / 2))
        svgShape.setAttribute('rx', shapeDims[2] * scalingFactorX / 2)
        svgShape.setAttribute('ry', (shapeDims[3] || shapeDims[2]) * scalingFactorY / 2)
        break

      case 'polygon':
        svgShape.setAttribute('points', shapeDims
          .map((v: number, i: number) => (
            i % 2 === 0
              ? v * scalingFactorX
              : v * scalingFactorY
          )).join(','))
        break

      case 'line': case 'arrow': case 'darrow':
        svgShape.setAttribute('points', shapeDims
          .map((v: number, i: number) => (
            i % 2 === 0
            ? v * scalingFactorX
            : v * scalingFactorY
          )).join(','))

        // overwrite fill property
        svgShape.setAttribute('fill', 'transparent')

        if (shapeName === 'line') {
          break
        }

        defs.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'marker'))
        defs.children[0].setAttribute('id', `marker${randomid}`)
        defs.children[0].setAttribute('orient', 'auto-start-reverse')
        defs.children[0].setAttribute('marker-units', 'strokeWidth')

        defs.children[0].setAttribute('markerWidth', String(15 * scalingFactorX))
        defs.children[0].setAttribute('markerHeight', String(10 * scalingFactorY))
        defs.children[0].setAttribute('refX', String(1.5 * scalingFactorX))
        defs.children[0].setAttribute('refY', String(2 * scalingFactorY))

        defs.children[0].appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'path'))
        defs.children[0].children[0].setAttribute('d', `M0,0 L0,4 L4,2 Z`)
        defs.children[0].children[0].setAttribute('fill', pa.getProp(['stroke']) /* same as color as arrow body */)

        svgShape.setAttribute('marker-end', `url(#marker${randomid})`)

        if (shapeName === 'arrow') {
          break
        }

        svgShape.setAttribute('marker-start', `url(#marker${randomid})`)
        break

      default:
        return []
        // should never happen
    }
  }

  return [defs, svgShape]
}

const getOccluder = function(shapeData, sa) {
  const manipulate = function(event) {
    // TODO for some reason, the images seems to be exchanged sometimes
    // I think this is something Anki does for some reason
    const theImg = event.target

    const theSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    theSvg.setAttribute('viewBox', `0 0 ${event.target.width} ${event.target.height}`)
    theSvg.setAttribute('reserveAspectRatio', 'xMidYMid meet')

    const scalingFactorX = event.target.width / event.target.naturalWidth
    const scalingFactorY = event.target.height / event.target.naturalHeight

    for (const [yankid, /* yankName */, ...properties] of shapeData) {
      for (const shape of toSvgShape(
        properties,
        sa.propAccessor(`_${yankid}`),
        scalingFactorX,
        scalingFactorY,
      )) {
        theSvg.appendChild(shape)
      }
    }

    const wrapperRecord = document.createElement('record')
    wrapperRecord.setAttribute('class', occlusionClassName)

    theImg.parentNode.insertBefore(wrapperRecord, theImg)

    wrapperRecord.appendChild(theImg)
    wrapperRecord.appendChild(theSvg)
  }

  return manipulate
}

// const shapes = [
//   [0 /* yankid */, 0 /* imageid */, 'y1' /* yankName */, 'rect', [500, 500, 500, 200], 'some rect text'],
//   [1 /* yankid */, /* imageid */, 'y1' /* yankName */, 'polygon', [20, 20, 100, 30, 50, 120], 'some darrow text'],
// ]
export const renderOcclusion = function(rawHtml /* from formatter */, rawData, styleAccessor) {
  const images = rawHtml
    .flatMap(section => Array.from(section.querySelectorAll('img')))

  const events = []

  if (rawData.length > 0) {
    const occlusionStyle = document.createElement('style')
    occlusionStyle.innerHTML = occlusionCss
    document.body.appendChild(occlusionStyle)

    images
      .map((img, idx) => (
        rawData
          .filter(([/*yankid */, imageid]) => imageid === idx)
          .map(([yankid, /* imageid */, ...args]) => [yankid, ...args])
      ))
      .forEach((data, idx) => {
        if (data.length > 0) {
          const breadcrumb = String(Math.random()).substring(2)
          const breadcrumbClass = `sr--breadcrumb-${breadcrumb}`

          images[idx].classList.add(breadcrumbClass)

          events.push({
            breadcrumb: `.${breadcrumbClass}`,
            event: 'load',
            listener: getOccluder(data, styleAccessor),
          })
        }
      })
  }

  return events
}
