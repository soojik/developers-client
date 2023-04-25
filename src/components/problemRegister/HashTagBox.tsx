
interface HashTagprops { 
    handleHashTagClick : (index:Number,item:string)=>void
}

const HashTagBox = ({handleHashTagClick}:HashTagprops) => {



return(
<div className="flex flex-wrap justify-center items-center text-center pt-5">
  <p className="mr-3">헤시 태그:</p>
  {hashTagBox.map((item, index) => (
    <div className="m-2" key={index}>
      <button
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => {
          handleHashTagClick(index, item);
        }}
      >
        {item}
      </button>
    </div>
  ))}
</div>
)
}


export default HashTagBox;


let hashTagBox=[

    'React','CSS','Vue.js','JavaScript','TypeScript','Node.js','HTML','Angular','BackEnd','Java','Cloud'
]