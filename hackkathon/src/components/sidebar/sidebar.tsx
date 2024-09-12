import { AiOutlineHome } from "react-icons/ai";
import { BiSolidRightArrow } from "react-icons/bi";
import { BiCategoryAlt } from "react-icons/bi";
import { CiCircleList } from "react-icons/ci";
import { BsBox } from "react-icons/bs";
import { Link } from "react-router-dom";
function sidebar() {
  return (
    <div  className="flex flex-col  gap-y-6 w-45 pt-3 h-full  bg-[#F4F4F4]">
       <Link  to = "/" className="flex items-center gap-x-9  justify-between hover:bg-[rgba(244, 237, 175, 1)]"> <span className="flex items-center gap-x-3"> <AiOutlineHome className="text-2xl"/> Dashboard </span> <BiSolidRightArrow/> </Link> 
       <Link to="/category" className="flex items-center gap-x-9 justify-between"> <span className="flex items-center gap-x-3"> <BiCategoryAlt className="text-2xl"/> Category  </span><BiSolidRightArrow/>   </Link>
       <button className="flex items-center gap-x-9 justify-between"> <span className="flex items-center gap-x-3">  <CiCircleList className="text-2xl"/> Subcategory </span><BiSolidRightArrow/> </button>
       <button className="flex items-center gap-x-9 justify-between">  <span className="flex items-center gap-x-3"> <BsBox className="text-2xl"/> Group </span> <BiSolidRightArrow/> </button> 
    </div>
  )
}

export default sidebar;






















