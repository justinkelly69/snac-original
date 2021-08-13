import { v4 } from 'uuid'
import { itemType, has } from './helpers'
import { NSNameTest } from './regex'
import { saveAttributes} from './attributes'

export const clone = (snac, settings = {}, newID = false) => {
    const type = itemType(snac)
    return type === 'N' ? (cloneElement(snac, settings, newID)
    ) : type === 'T' ? (cloneText(snac, settings, newID)
    ) : type === 'D' ? (cloneCDATA(snac, settings, newID)
    ) : type === 'M' ? (cloneComment(snac, settings, newID)
    ) : type === 'P' ? (clonePI(snac, settings, newID)
    ) : null
}

export const cloneElement = (snac, settings = {}) => {
    const toggleSelected = has(settings, 'toggleSelected', [])
    const clearSelected = has(settings, 'clearSelected', false)
    const newID = has(settings, 'newID', false)
    return ({
        _: newID ? `N${v4()}` : snac._,
        S: snac.S,
        N: snac.N,
        A: cloneAttributes(snac.A),
        C: cloneChildren(snac.C, settings, newID),
        a: has(snac, 'a', true),
        o: has(snac, 'o', true),
        q: clearSelected ? false : toggleSelected.includes(snac._)
    })
}

export const cloneAttributes = (atts = {}) => {
    const newAtts = {}
    Object.keys(atts).forEach(attNS => {
        newAtts[attNS] = {}
        Object.keys(atts[attNS]).forEach(attName => {
            newAtts[attNS][attName] = atts[attNS][attName]
        })
    })
    return newAtts
}

export const cloneChildren = (kids = [], settings = {}) => {
    const remove = has(settings, 'remove', [])
    const replace = has(settings, 'replace', [])
    const newID = has(settings, 'newID', false)
    let newKids = []
    let removeIndex = 0

    kids.forEach(kid => {
        return remove.length > 0 && remove[removeIndex] === kid._ ? (
            removeIndex = removeIndex + 1,
            removeIndex === remove.length &&
            replace.forEach(rep => {
                newKids = [...newKids, clone(rep, { newID: newID })]
            })
        ) :
            newKids = [...newKids, clone(kid, settings)]
    })
    return newKids
}

export const cloneText = (snac, settings = {}) => {
    const toggleSelected = has(settings, 'toggleSelected', [])
    const clearSelected = has(settings, 'clearSelected', false)
    const newID = has(settings, 'newID', false)
    return ({
        _: newID ? `T${v4()}` : snac._,
        T: snac.T,
        q: clearSelected ? false : toggleSelected.includes(snac._)
    })
}

export const cloneCDATA = (snac, settings = {}) => {
    const toggleSelected = has(settings, 'toggleSelected', [])
    const clearSelected = has(settings, 'clearSelected', false)
    const newID = has(settings, 'newID', false)
    return ({
        _: newID ? `D${v4()}` : snac._,
        D: snac.D,
        q: clearSelected ? false : toggleSelected.includes(snac._)
    })
}

export const cloneComment = (snac, settings = {}) => {
    const toggleSelected = has(settings, 'toggleSelected', [])
    const clearSelected = has(settings, 'clearSelected', false)
    const newID = has(settings, 'newID', false)
    return ({
        _: newID ? `M${v4()}` : snac._,
        M: snac.M,
        q: clearSelected ? false : toggleSelected.includes(snac._)
    })
}

export const clonePI = (snac, settings = {}) => {
    const toggleSelected = has(settings, 'toggleSelected', [])
    const clearSelected = has(settings, 'clearSelected', false)
    const newID = has(settings, 'newID', false)
    return ({
        _: newID ? `P${v4()}` : snac._,
        L: snac.L,
        B: snac.B,
        q: clearSelected ? false : toggleSelected.includes(snac._)
    })
}

export const saveNode = (data, newNS, newName, atts) => {
    let [remove, replace] = [[], []]
    if (NSNameTest(newNS, newName)) {
        remove = [data._]
        replace = [{
            ...data,
            S: newNS,
            N: newName,
            A: saveAttributes(atts)
        }]
    }
    return { remove, replace }
}

export const newElement = (snac) => {
    const A = has(snac, 'A', {})
    const C = has(snac, 'C', [])
    return cloneElement({
        S: snac.S === '@' ? '' : snac.S,
        N: snac.N,
        A: cloneAttributes(A),
        C: cloneChildren(C, { newID: true }),
        a: true,
        o: true,
        q: false
    }, { newID: true })
}

export const newText = (txt = '') =>
    cloneText({
        T: txt,
        q: false,
    }, { newID: true })

export const newCDATA = (cdata = '') =>
    cloneCDATA({
        D: cdata,
        q: false
    }, { newID: true })

export const newComment = (comment = '') =>
    cloneComment({
        M: comment,
        q: false,
    }, { newID: true })

export const newPI = (lang = '', body = '') =>
    clonePI({
        L: lang,
        B: body,
        q: false,
    }, { newID: true })

export const newIPoint = () => ({
    _: `I${v4()}`,
    q: false,
})