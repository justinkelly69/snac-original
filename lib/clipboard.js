import { newElement, newText, clone, cloneChildren } from './clone'
import { itemType, unEscapeXML } from './helpers'
import { find, findIDs, pathIncrement, firstPath, lastPath  } from './find'
import { NSNameTest } from './regex'
import { getOuterElements } from './selector'
import { concatTextNodes } from './texts'

const removeNodes = (root, selectedPaths) => {
    const { prevItem, firstItem, lastItem, nextItem } = getOuterElements(root, selectedPaths)
    let remove = findIDs(root, selectedPaths)
    let replace = []
    if (itemType(prevItem) === 'T' ||
        itemType(firstItem) === 'T' ||
        itemType(lastItem) === 'T' ||
        itemType(nextItem) === 'T') {
        let T = ""
        if (itemType(prevItem) === 'T') {
            remove = [prevItem._, ...remove]
            T = T + prevItem.T
        }
        if (itemType(nextItem) === 'T') {
            remove = remove.concat(nextItem._)
            T = T + nextItem.T
        }
        replace = [newText(T)]
    }
    return { remove, replace }
}

export const cutNodes = (root, selectedPaths, selectedNodes) => {
    const { remove, replace } = removeNodes(root, selectedPaths, selectedNodes)
    const clipboard = cloneChildren(selectedNodes, { newID: true })
    return {
        remove,
        replace,
        clipboard,
        selectedPaths: [],
        selectedNodes: []
    }
}

export const copyNodes = (selectedNodes) => ({
    clipboard: cloneChildren(selectedNodes, { newID: true }),
    selectedNodes: [],
    selectedPaths: [],
})

export const deleteNodes = (root, selectedPaths, selectedNodes) => {
    const { remove, replace } = removeNodes(root, selectedPaths, selectedNodes)
    return {
        remove,
        replace,
        clipboard: [],
        selectedPaths: [],
        selectedNodes: []
    }
}

export const pasteNodes = (root, data, atts, clipboard) => {
    let [remove, replace, cb] = [[], [], []]
    const firstItem = firstPath(clipboard)
    const lastItem = lastPath(clipboard)

    if (clipboard.length === 1) {
        if (itemType(firstItem) === 'T') {
            cb = [newText(atts.before + clipboard.slice(0, 1)[0].T + atts.after)]
        }
        else {
            cb = [
                newText(atts.before),
                clone(clipboard[0], { newID: true }),
                newText(atts.after)
            ]
        }
    }
    else {
        if (itemType(firstItem) === 'T' && itemType(lastItem) !== 'T') {
            cb = [newText(atts.before + firstItem.T)]
                .concat(cloneChildren(clipboard.slice(1), { newID: true }))
                .concat(newText(atts.after))
        }
        else if (itemType(firstItem) !== 'T' && itemType(lastItem) === 'T') {
            cb = [newText(atts.before)]
                .concat(cloneChildren(clipboard.slice(0, -1), { newID: true }))
                .concat(newText(lastItem.T + atts.after))
        }
        else if (itemType(firstItem) !== 'T' && itemType(lastItem) !== 'T') {
            cb = [newText(atts.before)]
                .concat(cloneChildren(clipboard, { newID: true }))
                .concat(newText(atts.after))
        }
        else {
            cb = [newText(atts.before + firstItem.T)]
                .concat(cloneChildren(clipboard.slice(1, -1), { newID: true }))
                .concat(newText(lastItem.T + atts.after))
        }
    }
    remove = [data._]
    replace = cloneChildren(cb, { newID: true })
    return {
        remove,
        replace
    }
}

export const wrapNodes = (newNS, newName, root, selectedPaths, selectedNodes) => {
    let [remove, replace, wrapper, newPath, newPaths, path] = [[], [], null, null, null, null]

    if (NSNameTest(newNS, newName)) {
        const { prevItem, firstItem, lastItem, nextItem } = getOuterElements(root, selectedPaths)
        let children = cloneChildren(selectedNodes, { newID: true })
        let isText = false
        remove = findIDs(root, selectedPaths)

        if (itemType(prevItem) === 'T' ||
            itemType(firstItem) === 'T' ||
            itemType(lastItem) === 'T' ||
            itemType(nextItem) === 'T') {
            isText = true

            if (itemType(firstItem) !== 'T') {
                children = [newText('')].concat(children)
            }

            if (itemType(lastItem) !== 'T') {
                children = children.concat(newText(''))
            }
        }
        else if (itemType(prevItem) === null && itemType(nextItem) === null) {
            children = [newText('')]
                .concat(firstItem)
                .concat(newText(''))
        }

        wrapper = newElement({
            S: newNS,
            N: newName,
            C: children
        })

        replace = [wrapper]
        wrapper = clone(wrapper, { toggleSelected: [wrapper._], newID: false })

        newPath = [...selectedPaths[0]]
        newPaths = [newPath]
        path = newPath

        if (isText) {

            if (itemType(prevItem) !== 'T') {
                replace = [newText('')].concat(replace)
                newPath = pathIncrement(newPath)
                newPaths = [...newPaths, newPath]
                path = newPath
            }

            if (itemType(nextItem) !== 'T') {
                replace = replace.concat(newText(''))
                newPath = pathIncrement(newPath)
                newPaths = [...newPaths, newPath]
            }
        }
    }
    return ({
        remove,
        replace,
        wrapper,
        path,
        selectedPaths: newPaths,
        selectedNodes: wrapper
    })
}

export const unwrapNode = (root, path = []) => {
    const currItem = find(root, [...path]).slice(-1)[0]
    const { prevItem, nextItem } = getOuterElements(root, [path])
    let remove = []
    let replace = []

    if (prevItem && nextItem) {
        remove = [prevItem._, currItem._, nextItem._]

        if (itemType(currItem) === 'N') {
            const children = cloneChildren(currItem.C, { newID: true })
            const firstItem = firstPath(children)
            const lastItem = lastPath(children)
            replace = cloneChildren(currItem.C, { newID: true })

            if (itemType(prevItem) === 'T' ||
                itemType(firstItem) === 'T' ||
                itemType(lastItem) === 'T' ||
                itemType(nextItem) === 'T') {

                if (children.length === 1 &&
                    itemType(prevItem) === 'T' &&
                    itemType(firstItem) === 'T' &&
                    itemType(nextItem) === 'T') {
                    replace = [concatTextNodes(prevItem, firstItem, nextItem)]
                }

                else if (children.length > 1) {

                    if (itemType(prevItem) === 'T' &&
                        itemType(firstItem) === 'T') {
                        replace = [concatTextNodes(prevItem, firstItem)]
                            .concat(replace.slice(1))
                    }

                    if (itemType(nextItem) === 'T' &&
                        itemType(lastItem) === 'T') {
                        replace = replace.slice(0, -1)
                            .concat(concatTextNodes(lastItem, nextItem))
                    }
                }
            }
        }
        else if (itemType(currItem) === 'D'
            && itemType(prevItem) === 'T'
            && itemType(nextItem) === 'T') {
            replace = [newText(`${prevItem.T}${unEscapeXML(currItem.D)}${nextItem.T}`)]
        }
        else if (itemType(currItem) === 'M'
            && itemType(prevItem) === 'T'
            && itemType(nextItem) === 'T') {
            replace = [newText(`${prevItem.T}${unEscapeXML(currItem.M)}${nextItem.T}`)]
        }
        else if (itemType(currItem) === 'P'
            && itemType(prevItem) === 'T'
            && itemType(nextItem) === 'T') {
            replace = [newText(`${prevItem.T}${unEscapeXML(currItem.B)}${nextItem.T}`)]
        }
    }
    return ({ remove, replace })
}
