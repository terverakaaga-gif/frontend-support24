import React, { useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Camera } from 'lucide-react';

const EditableAvatar = () => {
    const {user} = useAuth()
  const [profileImage, setProfileImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // Generate initials as fallback
  const getInitials = () => {
    // This would normally use actual user data
    // For example: 
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
    // return "JD"; // Example initials
  };

  return (
    <div className="relative flex flex-col items-center mb-4">
      <div className="relative">
        <div className="h-24 w-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center border-2 border-gray-300">
            <img 
              src={user?.profileImage || getInitials()} 
              alt="Profile" 
              className="h-full w-full object-cover"
            />
        
          
          {/* Edit button - always visible */}
          <div 
            className="absolute bottom-0 right-0 bg-white p-1 rounded-full border-2 border-gray-300 cursor-pointer shadow-md"
            onClick={triggerFileInput}
            aria-label="Edit profile picture"
          >
            <Camera className="text-blue-500" size={16} />
          </div>
        </div>
      </div>
      
      {/* Edit text indication */}
      <span className="text-sm text-blue-500 mt-2 cursor-pointer" onClick={triggerFileInput}>
        Edit profile photo
      </span>
      
      {/* Hidden file input */}
      <input 
        type="file" 
        ref={fileInputRef}
        name="image"
        accept="image/*"
        className="hidden"
        onChange={handleImageChange}
      />
    </div>
  );
};

export default EditableAvatar;