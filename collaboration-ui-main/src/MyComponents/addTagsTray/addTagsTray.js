import "./addTagsTray.css"
import {useEffect, useState} from "react";

function AddTagsTray({tagList,onTagDeleteClick, onTagAdded,disable}) {
    const [tag,setTag] = useState("")
    const [list, setList] = useState([]);

    useEffect(() => {
        setList(tagList)
    }, [tagList]);

    function addTag(){
        if(tag && tag!=""){
            const isTagInList = list.some((item) => item.toLowerCase() === tag.toLowerCase());
            if(isTagInList){
                alert(`tag ${tag} already exist`)
            }else{
                list.push(tag)
                setTag("")
                onTagAdded(list)
            }
        }else {
            alert(`Add tag`)
        }

    }

return (
    <div className={"sb-tags-container"}>
        <div className={"sb-tag-input-container"}>
            <input
                placeholder={"Add tag"}
                className={"sb-tag-input"}
                value={tag}
                onChange={(e)=>{
                    setTag(e.target.value)
                }}
            />
            <button
                disabled={disable}
                onClick={()=>{addTag()}}
                className={"sb-tag-add-btn"}>
                Add
            </button>
        </div>
        <div className={"sb-tags-button-container"}>
            {list.map((item,i)=>{
                return(
                    <button
                        disabled={disable}
                        className={"tag-btn"} onClick={()=>{
                        onTagDeleteClick(item,i)
                    }}>
                        <div>{item}</div>
                        <svg width="17" height="15" viewBox="0 0 17 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12.5463 3.75L4.40283 11.25" stroke="white" stroke-linecap="round"
                                  stroke-linejoin="round"/>
                            <path d="M4.40283 3.75L12.5463 11.25" stroke="white" stroke-linecap="round"
                                  stroke-linejoin="round"/>
                        </svg>
                    </button>
                )
            })}
        </div>
    </div>
)
}

export default AddTagsTray;