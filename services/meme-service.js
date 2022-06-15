'use strict'

var gImgs = []
var gMemes = []
var gMeme
var gKeywords = {}

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
}

function setGKeywords(keywords) {
    var flattenKeys = flatten(keywords)
    flattenKeys.map(key => {
        if (!gKeywords[`${key}`]) gKeywords[`${key}`] = 0
    })
}

function getKeywords() {
    return gKeywords
}
function getGImgs() {
    return gImgs
}
