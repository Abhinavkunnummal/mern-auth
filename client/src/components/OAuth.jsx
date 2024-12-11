import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../Redux/user/userSlice";
import { useState } from "react";

export default function OAuth() {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false); // Loading state for user feedback

    const handleGoogleClick = async () => {
        setLoading(true); // Start loading
        try {
            // Initialize Google provider and Firebase auth
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);
            
            // Trigger Google Sign-In
            const result = await signInWithPopup(auth, provider);
            
            // Extract user details
            const user = result.user || {};
            const name = user.displayName || "Anonymous";
            const email = user.email || "";
            const photoURL = user.photoURL || "";

            // Send user data to the backend
            const res = await fetch("/backend/auth/google", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, photoURL }),
            });

            // Check if the API call was successful
            if (!res.ok) {
                throw new Error(`Failed to authenticate: ${res.statusText}`);
            }

            // Parse response
            const data = await res.json();
            console.log(data);

            // Update Redux store
            dispatch(signInSuccess(data));
        } catch (error) {
            console.error("Google Sign-In failed:", error.message);
        } finally {
            setLoading(false); // End loading
        }
    };

    return (
        <button
            type="button"
            onClick={handleGoogleClick}
            disabled={loading} // Disable button while loading
            className={`bg-red-700 text-white rounded-lg p-3 hover:opacity-95 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
            {loading ? "Processing..." : "Continue With Google"}
        </button>
    );
}
