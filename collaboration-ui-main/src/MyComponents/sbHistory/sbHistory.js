import {useEffect, useState} from "react";
import "./sbHistory.css"
import classNames from "classnames";
import moment from "moment";
import utils from "../../utils";

function SBHistory({list,onItemClick}) {
    const [historyList, setHistoryList] = useState([])

    useEffect(() => {
        if(list && list.length > 0){
            let templist = []
            list.map((item,i)=>{
                if(item.time && item.time !=""){
                    let obj = {
                        time: moment(item.time).format("DD MMM YYYY, h:mm a"),
                        action: item.action,
                        user: item.user,
                        active: false,
                        fullData: item.fullData,
                    }
                    templist.push(obj)
                }
            })
            templist.push({current:true,active:true})
            setHistoryList(templist.reverse())
        }
    }, [list]);

    function renderHistoryData(item, i) {
        return(
            <li className={classNames(
                "sb-history-link-item",
                item.active ? "sb-history-link-item-active" : ""
            )}
                onClick={() => {
                    let tempList = [...historyList]
                    tempList.map((item2, i2) => {
                        if (i == i2) {
                            item2.active = true
                        } else {
                            item2.active = false
                        }
                    })
                    setHistoryList(tempList)
                    onItemClick(item)
                }}
            >
                {item.current && <div>Current</div>}
                <div>{item.time}</div>
                <div>{item.action} {item.user}</div>
            </li>
        )
    }

    return (
            <ul className={"sb-history-link-list"}>
                {historyList.map((item, i) => renderHistoryData(item, i))}
            </ul>
    )
}

export default SBHistory