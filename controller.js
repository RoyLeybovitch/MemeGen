'use strict'

var gElCanvas
var gCtx

function onInit() {
    gElCanvas = document.getElementById('my-canvas')
    gCtx = gElCanvas.getContext('2d')
    createGImgs(18)
    createMemes()
    renderKeys()
    renderGallery()
    renderCanvas()
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

function renderKeys() {
    var keywords = getKeywords()
    var keysContainer = document.querySelector('.keywords-container')
    var strHtml = `<p class="key president" style="font-size: ${keywords['president'] * 2 + 16}px ;"  
    onclick="onSetImgByKey('president',this)">President</p>
  <p style="font-size: ${keywords['man'] * 2 + 16}px ;" class="key man" onclick="onSetImgByKey('man',this)">Man</p>
  <p class="key dog"style="font-size: ${keywords['dog'] * 2 + 16}px;"  onclick="onSetImgByKey('dog',this)">Dog</p>
  <p class="key baby" style="font-size: ${keywords['baby'] * 2 + 16}px;"  onclick="onSetImgByKey('baby',this)">Baby</p>
  <p class="key cat" style="font-size: ${keywords['cat'] * 2 + 16}px; " onclick="onSetImgByKey('cat',this)">Cat</p>
  <p class="key cartoon" style="font-size: ${keywords['cartoon'] * 2 + 16}px;" onclick="onSetImgByKey('cartoon',this)">Cartoon</p>
  `
    keysContainer.innerHTML = strHtml
}

function renderCanvas(value = null) {
    var meme = getMeme()
    var url = getUrlByMeme(meme)
    var img = new Image()
    img.src = `${url}`
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
        changeTextOnCanvas()
        if (gMeme.selectedLineIdx !== 'none') drawLineArea()
        else if (value === 'isExport') {
            uploadImg()
        } else if (value === 'isDownload') {
            const elLink = document.createElement('a')
            const data = gElCanvas.toDataURL('image/jpeg')
            elLink.setAttribute('download', 'my-meme')
            elLink.href = data
            document.body.appendChild(elLink)
            elLink.click()
            document.body.removeChild(elLink)
        } else if (value === 'isSave') {
            var elBtn = document.querySelector('.save-btn')
            loadSavedMemes()
            saveMeme(gElCanvas)
            elBtn.innerHTML = 'saved!'
            setTimeout(() => {
                elBtn.innerHTML = 'save'
            }, 1000)
        }
    }
}

function onImgInput(ev) {
    loadImageFromInput(ev, renderImg)
}

function loadImageFromInput(ev, onImageReady) {
    var reader = new FileReader()

    reader.onload = function (event) {
        var img = new Image()
        img.src = event.target.result

        img.onload = onImageReady.bind(null, img)
    }
    reader.readAsDataURL(ev.target.files[0])
}

function renderImg(img) {
    gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
}

function renderGallery() {
    var imgs = getGImgs()
    var galleryContainer = document.querySelector('.gallery-container.main-layout')
    var strHtml = ``
    imgs.forEach(img => {
        strHtml += `<div class="gallery-img img-${img.id}" onclick="onShowEditor(this)" id='${img.id}' style="background-image:url('img/${img.id}.jpg') ; background-size: cover; background-position: center center;"></div>`
    })
    galleryContainer.innerHTML = strHtml
}

function resizeCanvas() {
    var elContainer = document.querySelector('.canvas-container')
    gElCanvas.width = elContainer.offsetWidth
    gElCanvas.height = elContainer.offsetHeight
}
