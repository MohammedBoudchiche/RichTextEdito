export default function Toolbar({handleFormatClick}:any) {
  return (
    <div>
        <button onClick={()=>{
            handleFormatClick('bold')
        }}>
          italic
        </button>
    </div>
  )
}
