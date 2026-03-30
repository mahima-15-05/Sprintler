import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="bg-[#1e293b] border-b border-gray-700 px-6 py-4 flex justify-between items-center">

      {/* LEFT */}
     <h1
  className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent cursor-pointer"
  onClick={() => navigate("/dashboard")}
>
  Sprintler
</h1>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
      
         <div className="flex items-center gap-2 text-sm text-neutral-400">
          <div className="w-7 h-7 rounded-full bg-neutral-800 flex items-center justify-center text-xs text-white">
            {user?.name?.charAt(0) || "U"}
          </div>
          <span>{user?.name || "User"}</span>
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;