import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Header() {
  const currentUser = useSelector((state) => state.user.currentUser);

  return (
    <div className="bg-slate-200">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className="font-bold">Auth App</h1>
        </Link>
        <ul className="flex gap-4">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li>
            <Link to="/profile">
              {currentUser ? (
                <img
                  src={currentUser.profilePicture}
                  alt="User Profile"
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                "Sign In"
              )}
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
