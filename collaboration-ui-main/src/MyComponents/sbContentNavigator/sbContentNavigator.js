import {useEffect, useRef, useState} from "react";
import utils from "../../utils";
import "./sbContentNavigator.css"
import classNames from "classnames";

function SBContentNavigator({htmlString,onElementClick,refAddedContent}) {
    // const refId = 0

    const containerRef = useRef(null);

    const h1Ref = useRef(null);
    const h2Ref = useRef(null);
    const h3Ref = useRef(null);

    const [hierarchyList, steHierarchyList] = useState([])

    useEffect(() => {
        // const htmlString2 = '<h1>hkhk</h1><h3><br></h3><h3>sd</h3><p><br></p><h3>bgjh</h3><h1>Heaader 2</h1><h2>subsdj</h2><h3>sasda</h3><h1>hkhk</h1><h3><br></h3><h3>sd</h3><p><br></p><h3>bgjh</h3><h1>Heaader 2</h1><h2>subsdj</h2><h3>sasda</h3><h1>hkhk</h1><h3><br></h3><h3>sd</h3><p><br></p><h3>bgjh</h3><h1>Heaader 2</h1><h2>subsdj</h2><h3>sasda</h3><h1>hkhk</h1><h3><br></h3><h3>sd</h3><p><br></p><h3>bgjh</h3><h1>Heaader 2</h1><h2>subsdj</h2><h3>sasda</h3><h1>hkhk</h1><h3><br></h3><h3>sd</h3><p><br></p><h3>bgjh</h3><h1>Heaader 2</h1><h2>subsdj</h2><h3>sasda</h3><h1>hkhk</h1><h3><br></h3><h3>sd</h3><p><br></p><h3>bgjh</h3><h1>Heaader 2</h1><h2>subsdj</h2><h3>sasda</h3><h1>hkhk</h1><h3><br></h3><h3>sd</h3><p><br></p><h3>bgjh</h3><h1>Heaader 2</h1><h2>subsdj</h2><h3>sasda</h3><h1>hkhk</h1><h3><br></h3><h3>sd</h3><p><br></p><h3>bgjh</h3><h1>Heaader 2</h1><h2>subsdj</h2><h3>sasda</h3><h1>hkhk</h1><h3><br></h3><h3>sd</h3><p><br></p><h3>bgjh</h3><h1>Heaader 2</h1><h2>subsdj</h2><h3>sasda</h3>';
        let refAddedString = createElementsWithRefs(htmlString)
        let hierarchy = utils.utilFunctions.extractHierarchy(refAddedString)
        steHierarchyList(hierarchy === null ? [] : hierarchy)
    }, [htmlString])


    const createElementsWithRefs = (htmlString) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, 'text/html');

        // Add refs to h1, h2, and h3 elements
        doc.querySelectorAll('h1').forEach((element, index) => {
            element.setAttribute('ref', `h1Ref${index}`);
        });

        doc.querySelectorAll('h2').forEach((element, index) => {
            element.setAttribute('ref', `h2Ref${index}`);
        });

        doc.querySelectorAll('h3').forEach((element, index) => {
            element.setAttribute('ref', `h3Ref${index}`);
        });

        // Return the modified HTML string
        return doc.documentElement.outerHTML;
    };

    function renderHierarchyData(item, i) {
        return(
            <li className={classNames(
                "sb-content-tree-item",
                item.tag == "H1" ? "sb-h1" : (item.tag == "H2" ? "sb-h2" : "sb-h3")
            )}>
                <div className={"sb-content-tree-item-text"}
                onClick={()=>{
                    let eRef = item.ref
                    // onElementClick(eRef)
                    // if (false && containerRef.current) {
                    //     const htmlContent = containerRef.current.innerHTML;
                    //     const tempElement = document.createElement('div');
                    //     tempElement.innerHTML = htmlContent;
                    //     const elements = tempElement.querySelectorAll(':is(h1, h2, h3, h4, h5, h6, p, span):not([class*="no-scroll"])');
                    //     if (elements.length > 0) {
                    //         elements.forEach(element => {
                    //             if (element.textContent.includes('fiji')) {
                    //                 // Scroll to the element
                    //                 element.scrollIntoView({ behavior: 'smooth' });
                    //             }
                    //         });
                    //     }
                    // }
                }}
                >{item.text}</div>
                <ul>
                    {renderParent(item.child)}
                </ul>
            </li>
        )
    }

    function renderParent(hierarchyList){
        return (
            <ul className={"sb-content-tree-list"}>
                {hierarchyList.map((item, i) => renderHierarchyData(item, i))}
            </ul>
        )
    }

    return (
        <div ref={containerRef}>
            {renderParent(hierarchyList)}
        </div>
    )
}

export default SBContentNavigator;