import Navbar from "../navbar/navbar";
import Sidebar from "../sidebar/sidebar"; 

function Subcategory() {
  return (
    <div className="flex flex-col">
      <Navbar />
      <div className="flex"> 
        <Sidebar /> 
      </div>
    </div>
  );
}

export default Subcategory;
