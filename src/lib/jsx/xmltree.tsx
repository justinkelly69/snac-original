import React from "react";

import { SNACChild, SNACElement, SNACText, SNACCDATA, SNACComment, SNACPI } from "../src/types";

const XmlTree = (snac: any) => {
    return (
        <XMLElement snac={snac} />
    )
}

export const XMLElement = (snac: any) => {

    return (
        <div className="xml-page">
            <div className="xml-tag">
                &lt;
                {snac.S && <>
                    <span className="xml-ns">
                        {snac.S}
                    </span>
                    :
                </>
                }
                <span className="xml-name">
                    {snac.N}
                </span>
                &gt;
            </div>
        </div>
    )
}

export default XmlTree;