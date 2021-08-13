import { itemType, escapeXML, escapeCDATA, escapeComment, escapePI } from './helpers'
import { makeSpacing } from './prefix'

export const snac2xml = snac => element2xml(snac, 0)

const element2xml = (snac, depth, prefix = "\t") => {
    const prefix1 = makeSpacing(depth, prefix)
    const prefix2 = makeSpacing(depth + 1, prefix)
    const nodeName = snac.S ? `${snac.S}:${snac.N}` : snac.N

    let xml = `${prefix1}<${nodeName} ${atts2xml(snac.A, depth, prefix)}>\n`
    snac.C.forEach((c, i) => {
        switch (itemType(c)) {
            case 'N':
                xml = xml + element2xml(c, depth + 1, prefix)
                break;
            case 'T':
                xml = xml + `${prefix2}${escapeXML(c.T)}\n`
                break;
            case 'D':
                xml = xml + `${prefix2}<![CDATA[${escapeCDATA(c.D)}]]>`
                break;
            case 'M':
                xml = xml + `${prefix2}<!--${escapeComment(c.M)}-->`
                break;
            case 'P':
                xml = xml + `${prefix2}<?${c.L} ${escapePI(c.B)}?>`
                break;
            default:
        }
    })
    xml = xml + `${prefix1}</${nodeName}>\n`
    return xml
}

const atts2xml = (atts, depth, prefix) => {
    let xml = ""
    const _prefix = makeSpacing(depth, prefix)
    Object.keys(atts).forEach(attNS => {
        Object.keys(atts[attNS]).forEach(attName => {
            xml += attNS === "@" ?
                `\n${_prefix} ${attName}="${escapeXML(atts[attNS][attName])}"` :
                `\n${_prefix} ${attNS}:${attName}="${escapeXML(atts[attNS][attName])}"`
        })
    })
    return xml
}