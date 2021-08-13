/**
 * Return the type of an item as a single letter
 * 'N' = Element node
 * 'T' = Text node
 * 'D' = CDATA eode
 * 'M' = Comment node
 * 'P' = Processing Instruction node
 * @param {string} item 
 */
export const itemType = item =>
    item !== null && item._ ?
        item._.slice(0, 1) :
        null

/**
* Check if array has a key and return the value at that key
* Otherwise return alt
* @param {array} arr Array to be tested
* @param {integer} key Key to find
* @param {integer} alt Return this if key not found
*/
export const has = (arr, key, alt) => arr.hasOwnProperty(key) ? arr[key] : alt

/**
 * @param {object} A is a set of attributes.
 * Return the attribute names.
 */
export const getNamespaces = A => Object.keys(A)

/**
 * @param {object} A is a set of attributes.
 * @param {string} ns is a namespace within the attributes
 * Return the attribute names in the namespace ns
 */
export const getNames = (A, ns) => Object.keys(A[ns])

/**
 * @param {string} ns is a namespace name
 * If ns is '@', return an empty string
 * Otherwise return ns
 */
export const getNS = ns => ns === '@' ? '' : ns

/**
 * @param {object} A is a set of attributes.
 * Return true id A is not empty.
 */
export const hasAttributes = A => {
    let result = false
    Object.keys(A).forEach(ns => {
        if (Object.keys(A[ns]).length > 0) {
            result = true
        }
    })
    return result
}

/**
 * Escape < > & ' " characters in a string
 * @param {String} str 
 */
export const escapeXML = str =>
    _escape(str, [
        ["&", "&amp;"],
        ["<", "&lt;"],
        [">", "&gt;"],
        ["'", "&apos;"],
        ['"', "&quot;"]
    ])

/**
 * Unescape &lt; &gt; &amp; &apos, &quot escape codes in a string.
 * @param {String} str 
 */
export const unEscapeXML = str =>
    _escape(str, [
        ["&lt;", "<"],
        ["&gt;", ">"],
        ["&amp;", "&"],
        ["&apos;", "'"],
        ["&quot;", '"']
    ])

/**
 * Escape ]]> as ]]&lt; in a CDATA string.
 * @param {String} str 
 */
export const escapeCDATA = str => _escape(str, [["]]>", "]]&gt;"]])

/**
 * Escape '--' as '- - ' in a Comment string.
 * If the first character is '-', replace it with '- '.
 * If the last character is '-', replace it with ' -'/
 * @param {String} str 
 */
export const escapeComment = str => _escape(str, [
    ["--", "- - "],
    [/^-/, " -"],
    [/-$/, "- "]
])

/**
 * Escape ?> as ?&lt; in a Processing Instruction string.
 * @param {String} str 
 */
export const escapePI = str => _escape(str, [["?>", "?&gt;"]])

/**
 * Replace each <string> with <replacement> in str and return the result
 * @param {String} str 
 * @param {Arrray of [string, replacement] pairs} subs 
 */
const _escape = (str, subs) => {
    subs.forEach(s => {
        str = str.split(s[0]).join(s[1])
    })
    return str
}

/**
 * Normalize a string. Convert all blocks of one or more space, tab 
 * and newline charcters with single spaces.
 * @param {String} txt 
 */
export const normalize = txt => txt.trim().split(/\s+/).join(' ')
