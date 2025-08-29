import { Italic } from 'lucide-react'
import { toggleFormat } from '../Editor/Utils/formatting'
export default function Toolbar({handleFormatClick}:any) {
  return (
    <div>
        <button onClick={()=>{
            handleFormatClick('bold')
        }}><Italic/></button>
    </div>
  )
}
