// src/pages/Signup.jsx
import React, { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from "react-hot-toast";
import {
  User, Lock, Phone, MapPin, Calendar,
  ShieldCheck, ArrowRight, Camera, Users, Home
} from 'lucide-react';

export default function Signup() {
  // --- Existing States ---
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [phone, setPhone] = useState('');
  const [photo, setPhoto] = useState(null); // Cloudinary secure_url

  // ✅ Renamed for consistency with backend
  const [addharCardNumber, setAddharCardNumber] = useState('');

  // ✅ --- NEW States for additional fields ---
  const [sex, setSex] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [relationType, setRelationType] = useState('');
  const [relativeName, setRelativeName] = useState('');

  // --- Other existing states and refs (no changes needed) ---
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const { signup } = useAuth();
  const nav = useNavigate();
  const [scanData, setScanData] = useState(null);

  // ----------- DOB → Age -----------
  const handleDobChange = (e) => {
    const dobValue = e.target.value;
    setDob(dobValue);
    if (dobValue) {
      const today = new Date();
      const birthDate = new Date(dobValue);
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--;
      }
      setAge(calculatedAge >= 0 ? calculatedAge.toString() : '');
    } else {
      setAge('');
    }
  };

  // ----------- Camera Logic -----------
  const startCamera = async () => {
    setShowCamera(true);
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        alert("Unable to access camera");
      }
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, 320, 240);

      canvas.toBlob(async (blob) => {
        if (blob) {
          const file = new File([blob], "live-photo.png", { type: "image/png" });
          const formData = new FormData();
          formData.append("file", file);
          formData.append("upload_preset", "user_live_photo_upload"); // replace with your Cloudinary preset

          try {
            const res = await fetch(
              "https://api.cloudinary.com/v1_1/dw4xzj0ie/image/upload", // replace with your Cloud name
              { method: "POST", body: formData }
            );
            const data = await res.json();
            if (data.secure_url) {
              setPhoto(data.secure_url); // ✅ store Cloudinary URL
            } else {
              alert("Upload failed. Try again.");
            }
          } catch (err) {
            console.error("Upload error:", err);
            alert("Failed to upload photo.");
          }
        }
      }, "image/png");

      // stop camera
      if (video.srcObject) {
        video.srcObject.getTracks().forEach((track) => track.stop());
      }
      setShowCamera(false);
    }
  };

  const removePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
  };


  // ✅ ----------- MODIFIED Form Submit -----------
  // src/pages/Signup.jsx

  // ... inside your Signup component ...

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Construct the userData object with the correct nested structure
      const userData = {
        name,
        age: Number(age), // Ensure age is a number
        dob,
        phone,
        email: email?.trim() || null,
        password,
        profilePhoto: photo,
        addharCardNumber,
        sex,
        // Create the nested address object
        address: {
          city,
          state,
          pincode
        },
        // Create the nested relative object
        relative: {
          relationType,
          relativeName
        }
      };

      // This object now perfectly matches your backend schema
      const success = await signup(userData);

      if (success) {
        nav("/dashboard");
      }
    } catch (err) {
      console.error("Submit Error:", err);
      // The signup function in AuthContext will show the toast error
    }
  };


  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
    "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim",
    "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand",
    "West Bengal", "Andaman & Nicobar Islands", "Chandigarh",
    "Dadra & Nagar Haveli & Daman & Diu", "Delhi", "Jammu & Kashmir",
    "Ladakh", "Lakshadweep", "Puducherry"
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 py-6 sm:py-12 px-3 sm:px-4 flex items-center justify-center">
      <div className="w-full max-w-4xl bg-slate-800/60 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-700/50 p-4 sm:p-6 md:p-8 lg:p-10">
        <div>
          <div className="mb-6 text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
            Register to Vote
          </h1>
          <p className="text-slate-400 text-sm sm:text-base">
            Create your secure VoteSafe account.
          </p>
          </div>


          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {/* --- MODIFIED Personal Info Section --- */}
            <div className="pb-4 border-b border-slate-700">
              <h3 className="text-base sm:text-lg font-semibold text-emerald-400 mb-3 sm:mb-4 flex items-center">
                <User className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />Personal Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5">
                <div className="md:col-span-2">
                  <label className="block text-slate-300 text-sm mb-1.5">Full Name</label>
                  <input value={name} onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name" required
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3.5 bg-slate-900/50 border-2 border-slate-700 rounded-lg sm:rounded-xl text-white text-sm sm:text-base focus:border-emerald-500 focus:outline-none transition-colors" />
                </div>
                <div>
                  <label>Date of Birth</label>
                  <input type="date" value={dob} onChange={handleDobChange} required className="w-full pl-4 pr-4 py-3.5 bg-slate-900/50 border-2 border-slate-700 rounded-xl text-white" />
                </div>
                <div>
                  <label>Age</label>
                  <input type="number" value={age} readOnly placeholder="Auto-calculated" className="w-full pl-4 pr-4 py-3.5 bg-slate-900/50 border-2 border-slate-700 rounded-xl text-white" />
                </div>
                {/* ✅ ADDED Sex dropdown */}
                <div>
                  <label>Sex</label>
                  <select value={sex} onChange={(e) => setSex(e.target.value)} required className="w-full pl-4 pr-4 py-3.5 bg-slate-900/50 border-2 border-slate-700 rounded-xl text-white">
                    <option value="">Select Sex</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* ✅ NEW: Family Information Section */}
            <div className="pb-4 border-b border-slate-700">
              <h3 className="text-lg font-semibold text-cyan-400 mb-4 flex items-center"><Users className="w-5 h-5 mr-2" />Family Information</h3>
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label>Relation</label>
                  <select value={relationType} onChange={(e) => setRelationType(e.target.value)} required className="w-full pl-4 pr-4 py-3.5 bg-slate-900/50 border-2 border-slate-700 rounded-xl text-white">
                    <option value="">Select Relation</option>
                    <option value="S/O">Son Of (S/O)</option>
                    <option value="W/O">Wife Of (W/O)</option>
                    <option value="D/O">Daughter Of (D/O)</option>
                  </select>
                </div>
                <div>
                  <label>Relative's Name</label>
                  <input value={relativeName} onChange={(e) => setRelativeName(e.target.value)} placeholder="Enter relative's full name" required className="w-full pl-4 pr-4 py-3.5 bg-slate-900/50 border-2 border-slate-700 rounded-xl text-white" />
                </div>
              </div>
            </div>

            {/* Live Photo section (no changes) */}
            {/* Live Photo */}
            <div className="pb-4 border-b border-slate-700">
              <h3 className="text-lg font-semibold text-pink-400 mb-4 flex items-center">
                <Camera className="w-5 h-5 mr-2" />
                Live Photo
              </h3>
              <div className="flex flex-col items-center space-y-3">

                {/* Button to start the camera (visible only before capture) */}
                {!photo && !showCamera && (
                  <button type="button" onClick={startCamera}
                    className="bg-blue-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl flex items-center space-x-2 hover:bg-blue-400 transition text-sm sm:text-base">
                    <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Click Live Photo</span>
                  </button>
                )}

                {/* Video feed and capture button (visible when camera is on) */}
                {showCamera && (
                  <div className="flex flex-col items-center space-y-2">
                    <video ref={videoRef} width={320} height={240} autoPlay
                      className="rounded-lg sm:rounded-xl border border-slate-700 w-full max-w-xs" />
                    <button type="button" onClick={capturePhoto}
                      className="bg-emerald-500 text-white px-4 py-2 rounded-xl hover:bg-emerald-400 transition">
                      Capture
                    </button>
                  </div>
                )}

                {/* Hidden canvas used for processing the image */}
                <canvas ref={canvasRef} width={320} height={240} style={{ display: "none" }} />

                {/* Image preview and remove button (visible after capture) */}
                {photo && (
                  <div className="flex flex-col items-center space-y-2">
                    <img src={photo} alt="Captured" className="rounded-xl border border-slate-700 w-40 h-32 object-cover" />
                    <button
                      type="button"
                      onClick={() => setPhoto(null)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-400 transition"
                    >
                      Remove Photo
                    </button>
                  </div>
                )}

              </div>
            </div>

            {/* --- MODIFIED Contact & Address Info Section --- */}
            <div className="pb-4 border-b border-slate-700">
              <h3 className="text-lg font-semibold text-sky-400 mb-4 flex items-center"><MapPin className="w-5 h-5 mr-2" />Contact & Address</h3>
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label>Phone No.</label>
                  <input type="tel" value={phone} maxLength={10} onChange={(e) => setPhone(e.target.value)} placeholder="10-digit mobile number" required className="w-full pl-4 pr-4 py-3.5 bg-slate-900/50 border-2 border-slate-700 rounded-xl text-white" />
                </div>
                <div>
                  <label>Email Address (Optional)</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your.email@example.com" className="w-full pl-4 pr-4 py-3.5 bg-slate-900/50 border-2 border-slate-700 rounded-xl text-white" />
                </div>

                <div>
                  <label>City</label>
                  <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g., Aligarh" required className="w-full pl-4 pr-4 py-3.5 bg-slate-900/50 border-2 border-slate-700 rounded-xl text-white" />
                </div>
                <div>
                  <label>State</label>
                  {/* Custom dropdown using <details> so it always expands downward (UI-only change) */}
                  <details className="w-full bg-slate-900/50 border-2 border-slate-700 rounded-lg sm:rounded-xl text-white">
                    <summary className="list-none cursor-pointer px-3 sm:px-4 py-2.5 sm:py-3.5 flex items-center justify-between text-sm sm:text-base">
                      <span className={`${state ? '' : 'text-slate-400'}`}>{state || 'Select State'}</span>
                      <span className="ml-2">▾</span>
                    </summary>
                    <div className="max-h-48 sm:max-h-56 overflow-auto mt-1 bg-slate-900/80 rounded-b-lg sm:rounded-b-xl border-t border-slate-700">
                      {indianStates.sort().map(stateName => (
                        <button
                          key={stateName}
                          type="button"
                          onClick={(e) => {
                            setState(stateName);
                            // close the details after selecting
                            const detailsEl = e.currentTarget.closest('details');
                            if (detailsEl) detailsEl.open = false;
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-slate-700 transition text-white"
                        >
                          {stateName}
                        </button>
                      ))}
                    </div>
                  </details>
                </div>
                <div className="md:col-span-2">
                  <label>Pincode</label>
                  <input value={pincode} onChange={(e) => setPincode(e.target.value)} placeholder="6-digit pincode" required className="w-full pl-4 pr-4 py-3.5 bg-slate-900/50 border-2 border-slate-700 rounded-xl text-white" />
                </div>
              </div>
            </div>

            {/* Security Section (variable name updated) */}
            <div>
              <h3 className="text-lg font-semibold text-purple-400 mb-4 flex items-center"><ShieldCheck className="w-5 h-5 mr-2" />Security & Authentication</h3>
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label>Aadhaar Number</label>
                  <input value={addharCardNumber} onChange={(e) => setAddharCardNumber(e.target.value)} maxLength={12} required placeholder="12-digit Aadhaar number" className="w-full pl-4 pr-4 py-3.5 bg-slate-900/50 border-2 border-slate-700 rounded-xl text-white" />
                </div>
                <div>
                  <label>Password</label>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a strong password" required className="w-full pl-4 pr-4 py-3.5 bg-slate-900/50 border-2 border-slate-700 rounded-xl text-white" />
                </div>
              </div>
            </div>

            {/* Submit button (no changes) */}
            <div className="pt-4 space-y-4">
              <button type="submit"
                className="w-full bg-emerald-400 hover:bg-emerald-300 text-white font-semibold py-3 sm:py-4 rounded-lg sm:rounded-xl shadow-lg flex items-center justify-center space-x-2 transition text-sm sm:text-base">
                <span>Create Account</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <div className="text-center">
                <span className="text-slate-400 text-sm">Already have an account? </span>
                <button onClick={() => nav('/login')} type="button"
                  className="font-semibold text-emerald-400 hover:text-emerald-300 transition-colors">
                  Login here
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
