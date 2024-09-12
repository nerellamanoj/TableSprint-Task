import AlertDialog from '../dialogbox/dialogbox';
function navbar() {

return (
    <div className="flex justify-between items-center pl-3 pr-3 p-3 bg-purple-800 w-screen">
      <h1 className="flex text-3xl items-center gap-2 font-bold text-white">
        <img className="z-10" src="https://res.cloudinary.com/djexsyuur/image/upload/v1726052864/Group_1000004703_t3y9kh.png" loading="lazy" alt="TableSprint logo" />
        TableSprint
      </h1>
      <AlertDialog />
    </div>
  );
}

export default navbar;
