
interface HashTagprops { 
    handleHashTagClick : (index:Number,item:string)=>void
}

const HashTagBox = ({handleHashTagClick}:HashTagprops) => {



return(
    <div className= "flex items-center flex-row text-center pt-5">
        헤시 태그 :
        {hashTagBox.map((item,index)=>

<div className="m-5">
        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={()=>{
handleHashTagClick(index,item);
        }}>
            {item}
        </button>
        </div>
        )}

    </div>
)
}


export default HashTagBox;


let hashTagBox=[

    'cs','backend','frontend','cloudschool'
]