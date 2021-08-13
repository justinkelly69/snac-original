export const R = {
    QNS : /^([A-Za-z_][A-Za-z0-9_]*|@|)$/,
    QNAME : /^[A-Za-z_][A-Za-z0-9_]*$/,
    LANG : /^[A-Za-z_][A-Za-z0-9_]*$/
}

export const NSNameTest = (newNS, newName) => R.QNS.test(newNS) && R.QNAME.test(newName)

export const attNSNameTest = (newNS, newName) => R.QNS.test(newNS) && R.QNAME.test(newName)

export const piLangTest = piLang => R.LANG.test(piLang)

export const attNS = newNS => {
    const NS = newNS.trim()
    return NS.length === 0 ? '@' : NS
}

export const attName = newName => newName.trim()