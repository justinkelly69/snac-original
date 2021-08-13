import { xml2snac } from './lib/xml2snac'
import { clone, saveNode } from './lib/clone'
import { snac2xml } from './lib/snac2xml'

import {
    attributesLength,
    attributesOpenClose,
    updateAttributeValue,
    markAttributeDeleted,
    insertAttribute,
    getAttribute,
    loadAttributes,
    saveAttributes,
    attsClose,
    attsOpen
} from './lib/attributes'

import {
    NSNameTest,
    attNSNameTest,
    piLangTest,
    attNS,
    attName
} from './lib/regex'

import {
    itemType,
    has,
    escapeXML,
    unEscapeXML,
    escapeCDATA,
    escapeComment,
    escapePI,
    normalize,
    getNS,
    getNamespaces,
    getNames,
    hasAttributes,
} from './lib/helpers'

import {
    find,
    findTag,
    findTags,
    findIDs,
    findID,
    findPrevID,
    findNextID,
    findParentID,
    pathParent,
    pathDecrement,
    pathIncrement
} from './lib/find'

import {
    insertNode,
    updateText,
    insertComment,
    updateComment,
    insertCDATA,
    updateCDATA,
    insertPI,
    updatePI
} from './lib/texts'

import {
    setSelected,
    clearSelected,
    clearAll
} from './lib/selector'

import {
    cutNodes,
    copyNodes,
    deleteNodes,
    pasteNodes,
    wrapNodes,
    unwrapNode
} from './lib/clipboard'

import {
    getPrefixItem,
    getPrefixString,
    getPrefixArray,
    getPrefix,
    makeSpacing
} from './lib/prefix'

export {
    xml2snac,
    clone,
    saveNode,
    snac2xml,
    attributesLength,
    attributesOpenClose,
    updateAttributeValue,
    markAttributeDeleted,
    insertAttribute,
    getAttribute,
    loadAttributes,
    saveAttributes,
    attsClose,
    attsOpen,
    NSNameTest,
    attNSNameTest,
    piLangTest,
    attNS,
    attName,
    itemType,
    has,
    escapeXML,
    unEscapeXML,
    escapeCDATA,
    escapeComment,
    escapePI,
    normalize,
    getNS,
    getNamespaces,
    getNames,
    hasAttributes,
    find,
    findTag,
    findTags,
    findIDs,
    findID,
    findPrevID,
    findNextID,
    findParentID,
    pathParent,
    pathDecrement,
    pathIncrement,
    insertNode,
    updateText,
    insertComment,
    updateComment,
    insertCDATA,
    updateCDATA,
    insertPI,
    updatePI,
    setSelected,
    clearSelected,
    clearAll,
    cutNodes,
    copyNodes,
    deleteNodes,
    pasteNodes,
    wrapNodes,
    unwrapNode,
    getPrefixItem,
    getPrefixString,
    getPrefixArray,
    getPrefix,
    makeSpacing
}