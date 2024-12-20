import { useSelector } from "react-redux";

export default function Profile() {
  const currentUser = useSelector((state) => state.user.currentUser);

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col items-center gap-4">
        <img
          src={currentUser.profilePicture}
          alt="profile"
          className="h-20 w-20 rounded-full object-cover cursor-pointer mt-2"
        />
        <input type="text" id="username" defaultValue={currentUser.username} placeholder="Username" className="bg-slate-100 rounded-lg p-3"/>
        <input type="email" defaultValue={currentUser.email} id="email" placeholder="Email" className="bg-slate-100 rounded-lg p-3"/>
        <input type="password" id="password"  placeholder="Password" className="bg-slate-100 rounded-lg p-3"/>
        <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">Update</button>
      </form>
      <div className="flex justify-between mt-5">
          <span className="text-red-700 cursor-pointer">Delete Account</span>
          <span className="text-red-700 cursor-pointer">Sign Out</span>
      </div>
    </div>
  );
}
