import { clone, cloneElement } from './clone'
import { itemType } from './helpers'

/**
 * Returns an array of snac items corresponding to the path.
 * Function is recursive and result is only calculated on successive steps
 * so result should not be given.
 * @param {snac} snac 
 * @param {array} path 
 * @param {array of snac} result 
 */
export const find = (snac, path, result = []) => {
    const [index, ...newPath] = path
    return snac ? (
        itemType(snac) === '@' ?
            find(snac.R, newPath, [cloneElement(snac.R, { newID: false })]) :
            itemType(snac) === 'N' ?
                find(snac.C[index], newPath, [...result, cloneElement(snac, { newID: false })]) :
                [...result, clone(snac, { newID: false })]
    ) : result
}

export const findTag = (snac, path) => {
    return find(snac, path)
}

export const findTags = (snac, paths) => {
    let out = []
    paths.forEach((path) => {
        out = [...out, findTag(snac, path)]
    })
    return out
}

/**
 * Find the id the last element in each of the paths and return them in an array.
 * @param {snac} snac 
 * @param {array} paths 
 */
export const findIDs = (snac, paths) => {
    let out = []
    paths.forEach((path) => {
        out = [...out, findID(snac, path)]
    })
    return out
}

/**
 * Find the id of the element at the end of the path
 * @param {snac} snac 
 * @param {array} path 
 */
export const findID = (snac, path) => find(snac, path).slice(-1)[0]._

/**
 * Find the id of the element before the element at the end of the path
 * @param {snac} snac 
 * @param {array} path 
 */
export const findPrevID = (snac, path) => findID(snac, pathDecrement(path))

/**
 * Find the id of the element after the element at the end of the path
 * @param {snac} snac 
 * @param {array} path 
 */
export const findNextID = (snac, path) => findID(snac, pathIncrement(path))

/**
 * Find the id of the parent element of the element at the end of the path
 * @param {snac} snac 
 * @param {array} path 
 */
export const findParentID = (snac, path) => findID(snac, pathParent(path))


/**
 * Returns the parent path of the current path.
 * If the path is [2,3,5,7] returns [2,3,5]
 * @param {array} path 
 */
export const pathParent = path => [...path.slice(0, -1)]

/**
 * Returns the path with the last element decremented by 1
 * If the path was [2,3,5,7] returns [2,3,5,6]
 * @param {array} path 
 */
export const pathDecrement = path => [...path.slice(0, -1), path.slice(-1)[0] - 1]

/**
 * Returns the path with the last element incremented by 1
 * If the path was [2,3,5,7] returns [2,3,5,8]
 * @param {array} path 
 */
export const pathIncrement = path => [...path.slice(0, -1), path.slice(-1)[0] + 1]

/**
 * Returns the first path in an array of paths
 * If the paths were 
 * [
 *      [2,3,5,3], // <-- First Path
 *      [2,3,5,4],
 *      [2,3,5,5],
 *      [2,3,5,6]
 * ]
 * returns [2,3,5,3]
 * @param {array} paths 
 */
export const firstPath = paths => paths.slice(0, 1)[0]

/**
 * Returns the last path in an array of paths
 * If the paths were 
 * [
 *      [2,3,5,3],
 *      [2,3,5,4],
 *      [2,3,5,5],
 *      [2,3,5,6]   // <-- Last Path
 * ]
 * returns [2,3,5,6]
 * @param {array} paths 
 */
export const lastPath = paths => paths.slice(-1)[0]

/**
 * Returns the index of the last child of an element node which will be length - 1
 * @param {snac} root 
 * @param {array} path 
 */
export const lastChildIndex = (root, path) => find(root, path).slice(-1)[0].C.length - 1

/**
 * Returns the index of the last child of the parent node of an element.
 * @param {snac} root 
 * @param {array} path 
 */
export const parentLastChildIndex = (root, path) => lastChildIndex(root, pathParent(path))

/**
 * Uses find to get the path to an item. Then returns the last item in the path
 * path = [2,3,4,2]
 * items = [
 *      {...},
 *      {...},
 *      {...},
 *      {...}   // <- returns this
 * ]
 * @param {snac} root 
 * @param {array} path 
 */
export const currPathItem = (root, path) => lastPath(find(root, path))

/**
 * Decrement the path. Then use find to find the last item in the decremented path
 * path = [2,3,4,2] becomes [2,3,4,1]
 * items = [
 *      {...},
 *      {...},
 *      {...},
 *      {...}   // <- returns this
 * ] 
 * @param {snac} root 
 * @param {array} path 
 */
export const prevPathItem = (root, path) =>
    lastPath(path) > 0 ?
        lastPath(find(root, pathDecrement(path))) :
        null

/**
 * Increment the path. Then use find to find the last item in the incremented path
 * path = [2,3,4,2] becomes [2,3,4,3]
 * items = [
 *      {...},
 *      {...},
 *      {...},
 *      {...}   // <- returns this
 * ] 
 * @param {snac} root 
 * @param {array} path 
 */
export const nextPathItem = (root, path) =>
    lastPath(path) < parentLastChildIndex(root, path) ?
        lastPath(find(root, pathIncrement(path))) :
        null


