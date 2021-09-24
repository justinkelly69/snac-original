import { findTags, findIDs, firstPath, lastPath,  currPathItem, prevPathItem, nextPathItem } from './find'
import { clone } from './clone'

export const setSelected = (root, _selectedPaths = [], path) => {

    let selectedPaths = updatePaths(_selectedPaths, path)
    let ids = findIDs(root, selectedPaths)
    let nodes = findTags(root, selectedPaths)

    let selectedNodes = []
    nodes.forEach((node, i) => {
        selectedNodes = [...selectedNodes, node[node.length - 1]]
    })

    return ({
        root: clone(root, { toggleSelected: ids, newID: true }),
        selectedPaths,
        selectedNodes
    })
}

export const clearSelected = root => ({
    root: clone(root, { clearSelected: true, newID: false }),
    selectedPaths: [],
    selectedNodes: []
})

export const clearAll = () => ({
    selectedPaths: [],
    selectedNodes: []
})

const updatePaths = (paths, newPath) => {
    if (newPath === null) {
        return []
    }
    else if (paths.length === 0) {
        return [[...newPath]]
    }
    else {
        const start = comparePaths(paths[0], newPath)
        const end = comparePaths(paths[paths.length - 1], newPath)

        if (start === -1) {
            return [[...newPath], ...paths]
        }
        else if (start === 0) {
            return [...paths.slice(1)]
        }
        else if (end === 1) {
            return [...paths, [...newPath]]
        }
        else if (end === 0) {
            return [...paths.slice(0, -1)]
        }
        else {
            return [[...newPath]]
        }
    }
}

/**
 * Compares 2 paths to see if they are adjacent
 * and if so, which comes first.
 * If path1 === path2, return 0
 * If path1 === path2 + 1, return -1
 * If path1 === path2 - 1, return +1
 * Else return null (Paths are not adjacent)
 * @param {array(int)} path1 
 * @param {array(int)} path2 
 */
const comparePaths = (path1, path2) => {
    if (path1.length === 0 || path2.length === 0 ||
        path1.length !== path2.length) {
        return null
    }
    else {
        let status = true
        path1.slice(0, -1).forEach((p, i) => {
            if (p !== path2[i]) {
                status = false
            }
        })
        if (status === true) {
            const p1 = path1[path1.length - 1]
            const p2 = path2[path2.length - 1]
            if (p1 === p2 + 1) {
                return -1
            }
            else if (p1 === p2 - 1) {
                return 1
            }
            else if (p1 === p2) {
                return 0
            }
        }
    }
    return null
}

/**
 * return {
 *      prevItem: previous node,
 *      firstItem: first child node,
 *      lastItem: last child node,
 *      nextItem: next node
 * }
 * @param {snac} root 
 * @param {array(paths)} selectedPaths 
 */
export const getOuterElements = (root, selectedPaths) => {
    const fp = firstPath(selectedPaths)
    const lp = lastPath(selectedPaths)
    return {
        prevItem: prevPathItem(root, fp),
        firstItem: currPathItem(root, fp),
        lastItem: currPathItem(root, lp),
        nextItem: nextPathItem(root, lp)
    }
}
