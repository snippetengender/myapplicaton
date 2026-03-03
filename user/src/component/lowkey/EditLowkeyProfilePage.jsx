import React, { useState, useRef, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import debounce from "lodash.debounce";
import api from "../../providers/api";
import { useSelector, useDispatch } from "react-redux";
import { fetchLowkeyProfile } from "../../features/userSlice/userSlice";

export default function EditLowkeyProfilePage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const profileUser = useSelector((state) => state.user.lowkeyProfile.data);
    const profileStatus = useSelector((state) => state.user.lowkeyProfile.status);

    const [username, setUsername] = useState("");
    const [isTaken, setIsTaken] = useState(null);
    const [checking, setChecking] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (profileStatus === "succeeded" && profileUser) {
            setUsername(profileUser.username || "");
        }
    }, [profileUser, profileStatus]);

    const checkUsername = useRef(
        debounce(async (name) => {
            // If they revert to their existing name, it's valid to submit but won't trigger taken logic
            if (profileUser && name === profileUser.username) {
                setIsTaken(false);
                setChecking(false);
                return;
            }

            if (name.trim().length < 3) {
                setIsTaken(null);
                return;
            }
            setChecking(true);
            try {
                const res = await api.post("/lowkey/check-username", { username: name });
                setIsTaken(!res.data.available);
            } catch (err) {
                console.error("Username check failed:", err);
                setIsTaken(null);
            } finally {
                setChecking(false);
            }
        }, 500)
    ).current;

    const handleUsernameChange = (e) => {
        const value = e.target.value.toLowerCase();
        setUsername(value);

        // Check if it matches existing since we allow them to just click save without changing
        if (profileUser && value === profileUser.username) {
            setIsTaken(false);
            setChecking(false);
        } else {
            checkUsername(value);
        }
    };

    const handleUpdate = async () => {
        if (!username || isTaken) {
            alert("Please choose a valid and available username.");
            return;
        }

        setSubmitting(true);
        try {
            await api.patch(`/lowkey/${profileUser.user_id}`, { username });
            // Refresh cache so they see the new name immediately
            dispatch(fetchLowkeyProfile(profileUser.user_id));
            navigate(-1);
        } catch (error) {
            console.error("Failed to update lowkey profile", error);
            alert(error.response?.data?.detail || "Failed to update profile.");
        } finally {
            setSubmitting(false);
        }
    };

    if (profileStatus === 'loading' || !profileUser) {
        return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-black text-brand-off-white px-4 py-6 flex flex-col justify-between">
            <div>
                {/* Back Button */}
                <button
                    aria-label="Go back"
                    className="mb-6 flex items-center"
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft className="text-brand-off-white mr-2" size={24} />
                    <span className="font-semibold text-lg">Edit Lowkey Profile</span>
                </button>

                <p className="text-sm text-brand-off-white mb-2 font-inter">
                    Choose a new lowkey username
                </p>

                {/* Username Input */}
                <div className="w-full mb-3">
                    <input
                        type="text"
                        placeholder="<username>"
                        maxLength={20}
                        value={username}
                        onChange={handleUsernameChange}
                        className="bg-transparent text-[22px] font-bold outline-none w-full placeholder:text-brand-medium-gray text-pink-500 border-b border-gray-700 pb-2 focus:border-pink-500 transition-colors"
                    />
                </div>

                {/* Character Count */}
                <p className="text-xs text-brand-charcoal mb-4 text-right pr-2">{username.length}/20</p>

                {/* Username Availability */}
                <div className="h-6">
                    {checking && (
                        <p className="text-sm text-yellow-400">
                            Checking availability...
                        </p>
                    )}
                    {isTaken === true && (
                        <p className="text-sm text-red-400">
                            Sorry, username already taken
                        </p>
                    )}
                    {isTaken === false && username && username !== profileUser.username && (
                        <p className="text-sm text-green-400">
                            Great! Username is available
                        </p>
                    )}
                    {username === profileUser.username && (
                        <p className="text-sm text-gray-400">
                            This is your current username
                        </p>
                    )}
                </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-center mt-10 mb-4 pb-10">
                <button
                    onClick={handleUpdate}
                    disabled={checking || !username || isTaken || submitting}
                    className={`w-full py-4 rounded-full font-bold text-lg transition-opacity ${checking || !username || isTaken || submitting
                            ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                            : "bg-white text-black hover:bg-gray-200"
                        }`}
                >
                    {submitting ? "Saving..." : "Save Changes"}
                </button>
            </div>
        </div>
    );
}
