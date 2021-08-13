export const updateAttributes = (A, ns, name, func1, func2) => {
    const newAtts = {}

    // If there is no A[ns], create it with a blank [name]
    !A.hasOwnProperty(ns) && (
        newAtts[ns] = {
            [name]: {
                open: false,
                deleted: false,
                value: null
            }
        }
    )

    // Map all this.state.data.A[ns] to atts[a]
    Object.keys(A).sort().map(a => {
        newAtts[a] = {}
        a === ns && !A[a].hasOwnProperty(name) && (
            newAtts[a][name] = {
                open: false,
                deleted: false,
                value: null
            }
        )

        // Map all A[idx1][idx2] to A[a][aa]
        // updating using func1 and func2
        Object.keys(A[a]).sort().map(aa => {
            (a === ns) && aa === name ?
                newAtts[a][aa] = func1(A[a][aa]) :
                newAtts[a][aa] = func2(A[a][aa])
        })
    })

    if (newAtts[ns][name]['value'] === null) {
        newAtts[ns][name] = func1(newAtts[ns][name])
    }

    return newAtts
}

export const getAttribute = (ns, name, A) => ({
    _: 'A',
    ns: ns,
    name: name,
    value: A[ns][name]
})

export const loadAttributes = (A) => {
    const newAtts = {}
    Object.keys(A).map(a => {
        newAtts[a] = {}
        Object.keys(A[a]).map((aa) => {
            newAtts[a][aa] = {
                open: false,
                deleted: false,
                value: A[a][aa]
            }
        })
    })
    return newAtts
}


// Map A to atts, removing index, deleted and open, keeping only value
// All attributes marked deleted get removed.
export const saveAttributes = (atts) => {
    const newAtts = {}
    Object.keys(atts).map(a => {
        newAtts[a] = {}
        return Object.keys(atts[a]).map(aa => {
            return (!atts[a][aa].deleted) ?
                newAtts[a][aa] = atts[a][aa].value :
                null
        })
    })
    return removeEmptyObjects(newAtts)
}

export const attsClose = atts => {
    const newAtts = {}
    Object.keys(atts).map(a => {
        newAtts[a] = {}
        return Object.keys(atts[a]).map((aa) => {
            newAtts[a][aa] = {
                ...atts[a][aa],
                open: false,
            }
        })
    })
    return newAtts
}

export const attsOpen = atts => {
    let isOpen = false
    Object.keys(atts).map(a => {
        return Object.keys(atts[a]).map((aa) => {
            atts[a][aa].open === true && (
                isOpen = true
            )
        })
    })
    return isOpen
}

const removeEmptyObjects = obj => {
    let newObj = {}
    Object.keys(obj).map(key => {
        Object.keys(obj[key]).length > 0 && (
            newObj[key] = { ...obj[key] }
        )
    })
    return newObj
}

export const attributesLength = (A) => {
    let length = 0;
    Object.keys(A).map(a => {
        Object.keys(A[a]).map(aa => {
            length = length + 1
        })
    })
    return length
}

export const attributesOpenClose = (atts, ns, name) =>
    updateAttributes(
        atts,
        ns,
        name,
        a => ({ ...a, open: !a.open }),
        a => ({ ...a, open: false }))

export const updateAttributeValue = (atts, ns, name, value) =>
    updateAttributes(
        atts,
        ns,
        name,
        a => ({ ...a, value: value }),
        a => ({ ...a }))

// Mark/Unmark attributes as deleted.
export const markAttributeDeleted = (atts, ns, name) =>
    updateAttributes(
        atts,
        ns,
        name,
        a => ({ ...a, deleted: !a.deleted }),
        a => ({ ...a }))

// Update the attributes with tne new attribute.
export const insertAttribute = (atts, newNS, newName, newValue) =>
    updateAttributes(
        atts,
        newNS === '' ? '@' : newNS,
        newName,
        a => ({ ...a, value: newValue }),
        a => ({ ...a }))
