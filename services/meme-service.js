'use strict'

var gImgs = []
var gMemes = []
var gMeme
var gKeywords = {}

// Uploade / Save memes
function saveMeme(canvas) {
    const data = canvas.toDataURL('image/jpeg/png')
    var memes = loadSavedMemes()
    if (!memes) saveToStorage('savedMemes', [data])
    else {
        memes.push(data)
        saveToStorage('savedMemes', memes)
    }
}

function loadSavedMemes() {
    return loadFromStorage('savedMemes')
}

function setGKeywords(keywords) {
    var flattenKeys = flatten(keywords)
    flattenKeys.map(key => {
        if (!gKeywords[`${key}`]) gKeywords[`${key}`] = 0
    })
}

// Creates

function createGImgs(length) {
    gImgs = []
    for (var i = 1; i < length + 1; i++) {
        var img = { id: i, url: `img/${i}.jpg` }
        gImgs.push(img)
    }
    const keywords = [
        ['man', 'president'],
        ['dog'],
        ['baby', 'dog'],
        ['cat'],
        ['baby'],
        ['man'],
        ['baby'],
        ['man'],
        ['baby'],
        ['man', 'president'],
        ['man'],
        ['man'],
        ['man'],
        ['man'],
        ['man'],
        ['man'],
        ['man', 'president'],
        ['cartoon'],
    ]
    gImgs.forEach((img, idx) => {
        img['keywords'] = keywords[idx]
    })

    setGKeywords(keywords)
}

function createMeme(id) {
    var meme = {
        selectedImgId: id,
        selectedLineIdx: 0,
        lines: [{}, {}],
        moveSticker: false,
    }
    meme.lines.forEach((line, idx) => {
        line['txt'] = ''
        line['size'] = 30
        line['fillColor'] = 'white'
        line['strokeColor'] = 'black'
        line['align'] = 'left'
        line['font-family'] = 'impact'
        line['width'] = 0
        line['x'] = 10
        line['isClick'] = false
        if (idx === 0) line['y'] = 50
        else line['y'] = 'init'
    })
    return meme
}

function createMemes() {
    gImgs.forEach((img, idx) => {
        var meme = createMeme(idx + 1)
        gMemes.push(meme)
    })
}

// Edit/Update gMEME/lines

function deleteLine() {
    gMeme.lines.splice(gMeme.selectedLineIdx, 1)
    gMeme.selectedLineIdx = gMeme.lines.length ? 0 : 'No Lines'
}

function addLine(CanvasHeight) {
    var line = {
        txt: '',
        size: 30,
        fillColor: 'white',
        strokeColor: 'black',
        align: 'left',
        'font-family': 'impact',
        x: 10,
        y: CanvasHeight / 2 + 10,
        width: 0,
    }
    gMeme.lines.push(line)
    gMeme.selectedLineIdx = gMeme.lines.length - 1
}

function checkLinesSizes(CanvasWidth, CanvasHeight) {
    gMeme.lines.forEach((line, idx) => {
        // Resize
        if (!line.isClick) {
            // if text is too wide
            if (line.width + 20 > CanvasWidth && CanvasWidth) {
                line.size -= 5
                line.x = 10
                updateRowWidth(line, idx)
                checkLinesSizes(CanvasWidth, CanvasHeight)
            }
            //if text is too big
            else if (line.size > CanvasHeight) {
                line.size = CanvasHeight - 10
            }
        }
        // if text is too low
        if (line.y > CanvasHeight - 10) {
            line.y = CanvasHeight - 10
        }
        //if text is too high
        if (line.y < line.size) line.y = line.size + 5
        //if line is too left
        if (line.width + line.x > CanvasWidth - 20) line.x = CanvasWidth - line.width - 10
        if (line.isClick) {
            //if line is too right
            if (line.x < 10) line.x = 10
        }
    })
}

function alignText(CanvasWidth, idx = null) {
    if (!gMeme.lines.length || getCurrLineIdx() === 'none') return
    var line = idx ? gMeme.lines[idx] : getCurrLine()
    switch (line.align) {
        case 'left':
            if ((line.x = 10)) return
            line.x = 10
            break

        case 'center':
            line.x = (CanvasWidth - line.width) / 2
            break

        case 'right':
            line.x = CanvasWidth - 10 - line.width
            break
    }
}

function updateLine(key, value, idx = null) {
    if (gMeme.selectedLineIdx === 'none' || !gMeme.lines.length) return
    var line = idx === null ? getCurrLine() : gMeme.lines[idx]
    switch (key) {
        case 'initY':
            gMeme.lines[1].y = value - 10
            break

        case 'textDown':
            line.y += line.y + 20 <= value ? 10 : 0
            break

        case 'textUp':
            line.y -= line.y - line.size >= 10 ? 10 : 0
            break

        case 'decreaseFont':
            line.size -= line.size > 10 ? 5 : 0
            break

        case 'increaseFont':
            line.size += 10
            if (line.size > line.y) line.y = line.size
            break

        case 'typeText':
            line.txt = `${value}`
            break

        case 'width':
            line.width = value
            break

        case 'font-family':
            line['font-family'] = value
            break

        case 'fill-color':
            line.fillColor = value
            break

        case 'stroke-color':
            line.strokeColor = value
            break

        case 'align-left':
            line.align = 'left'
            break

        case 'align-center':
            line.align = 'center'
            break

        case 'align-right':
            line.align = 'right'
            break
    }
}

function updateSelectedLineIdx(value = null) {
    if (!gMeme.lines.length) {
        return
    } else if (value === 'none') {
        gMeme.selectedLineIdx = 'none'
    } else if (gMeme.selectedLineIdx === 'none' || gMeme.selectedLineIdx === gMeme.lines.length - 1 || gMeme.lines.length === 1)
        gMeme.selectedLineIdx = 0
    else {
        gMeme.selectedLineIdx += 1
    }
}

function updateGmeme(elImgId) {
    if (elImgId === 'close') {
        if (!gMeme) return
        var cleanMeme = createMeme(gMeme.selectedImgId)
        var idx = gMemes.findIndex(meme => {
            return meme.selectedImgId === gMeme.selectedImgId
        })
        gMemes.splice(idx, 1, cleanMeme)
        gMeme = null
        return
    }
    var currMeme = gMemes.find(meme => {
        return `${meme.selectedImgId}` === elImgId
    })
    gMeme = currMeme
}

// Move Line

function moveClickedLine(pos) {
    var lineClicked = gMeme.lines[gMeme.selectedLineIdx]
    lineClicked.x = pos.x - lineClicked.width / 2
    lineClicked.y = pos.y + lineClicked.size / 2
}

function updateNoClick() {
    gMeme.isClick = false
    gMeme.lines[gMeme.selectedLineIdx].isClick = false
}

function getLineByPos(pos) {
    if (!gMeme.lines.length) return
    var clickedLine = gMeme.lines.find(line => {
        var xStart = line.x
        var xEnd = line.width + line.x
        var yEnd = line.y
        var yStart = line.y - line.size
        if (pos.x <= xEnd && pos.x >= xStart && pos.y >= yStart && pos.y <= yEnd) return line
    })
    if (clickedLine) updateClickedLine(clickedLine)
    return clickedLine
}

function updateClickedLine(clickedLine) {
    var idx = gMeme.lines.findIndex(line => {
        return line === clickedLine
    })
    gMeme.selectedLineIdx = idx
    gMeme.lines[idx].isClick = true
}

// Gets

function getOffsetPos(ev) {
    var pos = {
        x: ev.offsetX,
        y: ev.offsetY,
    }
    if (gTouchEvs.includes(ev.type)) {
        ev.preventDefault()
        ev = ev.changedTouches[0]
        pos = {
            x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
            y: ev.pageY - ev.target.offsetTop - ev.target.clientTop,
        }
    }
    return pos
}

function getKeywords() {
    return gKeywords
}

function getMeme() {
    return gMeme
}

function getCurrLineIdx() {
    return gMeme.selectedLineIdx
}

function getCurrLine() {
    return gMeme.lines[gMeme.selectedLineIdx]
}

function getGImgs() {
    return gImgs
}

function getLineArea() {
    if (gMeme.selectedLineIdx === 'none' || !gMeme.lines.length) return
    var line = gMeme.lines[gMeme.selectedLineIdx]
    return {
        x: line.x - 3,
        y: line.y - line.size + 3,
        width: line.width + 5,
        height: line.size + 3,
    }
}

function getUrlByMeme(meme) {
    var img = gImgs.find(img => {
        return img.id === meme.selectedImgId
    })
    return img.url
}

function updateKeys(val) {
    if (gKeywords[val] === 5) return
    gKeywords[val] += 1
}

function setImgByKey(key) {
    var KeyedImgs = []
    createGImgs(18)
    for (var i = 0; i < gImgs.length; i++) {
        var isKey = gImgs[i].keywords.find(keyword => {
            return keyword === key
        })
        if (isKey) KeyedImgs.push(gImgs[i])
    }
    if (KeyedImgs.length) gImgs = KeyedImgs
    return gImgs
}
