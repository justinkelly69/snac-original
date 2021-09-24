export const getPrefixItem = (type, index, data) => type === 'N' ? [index, data.C.length] : [index]

export const getPrefixString = (prefixArray, prefixOff, prefixOn) => {
    let out = ""
    prefixArray.forEach(prefixItem => {
        out = out + (prefixItem ? prefixOn : prefixOff)
    })
    return out
}

export const getPrefixArray = (prefixArray, enabled) => {
    let out = []

    prefixArray.forEach((prefixItem, index) => {
        index <= 1 ?
            out = [...out, false] :
            enabled ?
                prefixItem.length === 1 ?
                    out = [...out, true] :
                    prefixArray[index][0] < prefixArray[index - 1][1] - 1 ?
                        out = [...out, true] :
                        out = [...out, false] :
                out = [...out, false]
    })
    return out
}

export const getPrefix = (prefixArray, enabled, twoLine, prefixOn, prefixOff) => {
    let prefixString = ''
    prefixArray.forEach((prefixItem, index) => {
        index <= 1 ?
            prefixString = prefixString + prefixOff :
            enabled ?
                prefixItem.length === 1 ?
                    prefixString = prefixString + prefixOn :
                    prefixArray[index][0] < prefixArray[index - 1][1] - 1 ?
                        prefixString = prefixString + prefixOn :
                        prefixString = prefixString + prefixOff :
                prefixString = prefixString + prefixOff
    })
    return twoLine ?
        prefixString + prefixOn :
        prefixString
}

/**
 * Return a string of space characters of length length
 * @param {int} length 
 * @param {char} spaceChar 
 */
export const makeSpacing = (length, spaceChar) => {
    let prefix = ''
    length > 0 && Array(length).fill().forEach((_, i) => {
        prefix += spaceChar
    })
    return prefix
}