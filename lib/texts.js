import { newElement, newText, newCDATA, newComment, newPI } from './clone'
import { NSNameTest, piLangTest } from './regex'

export const insertNode = (data, atts) => {
    let [remove, replace, before, inside, insideText, after] =
        [[], [], '', '', '', '']
    if (NSNameTest(atts.S, atts.N)) {
        const S = atts.S || '@'
        inside = newElement({
            S: S,
            N: atts.N,
            A: {},
            C: [newText(atts.inside)]
        })
        before = newText(atts.before)
        after = newText(atts.after)
        remove = [data._]
        replace = [
            before,
            inside,
            after
        ]
        insideText = inside.C[0]
    }
    return ({ remove, replace, before, inside, insideText, after })
}

export const updateText = (data, text) => _update(data, { T: text })

/**
 * Concatenate the texts in 2 or more TextNodes 
 * and return them as a single node
 * @param  {...TextNode} textNodes 
 */
export const concatTextNodes = (...textNodes) => {
    let T = ""
    textNodes.forEach(textNode => {
        T = T + textNode.T
    })
    return newText(T)
}

// COMMENT EDITOR METHODS

export const insertComment = (data, atts) => _insert(data, atts, newComment(atts.inside))

export const updateComment = (data, comment) => _update(data, { M: comment })


// CDATA EDITOR METHODS

export const insertCDATA = (data, atts) => _insert(data, atts, newCDATA(atts.inside))

export const updateCDATA = (data, cdata) => _update(data, { D: cdata })

// PI EDITOR METHODS

export const insertPI = (data, atts) =>
    piLangTest(atts.lang) ?
        _insert(data, atts, newPI(atts.lang, atts.inside)) :
        { remove: [], replace: null, obj: {} }


export const updatePI = (data, lang, body) => _update(data, { L: lang, B: body })

const _insert = (data, atts, obj) => {
    const before = newText(atts.before)
    const after = newText(atts.after)
    const remove = [data._]
    const replace = [
        before,
        obj,
        after
    ]
    return ({ remove, replace, obj })
}

const _update = (data, obj) => ({
    remove: [data._],
    replace: [{
        ...data,
        ...obj,
        _: data._
    }]
})