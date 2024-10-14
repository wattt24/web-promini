import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Dashboard.css';


const Profile = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState({
        firstName: '',
        lastName: '',
        age: '',
        profileImage: null,
    });
    const [editMode, setEditMode] = useState(false); // ใช้เพื่อเช็คโหมดแก้ไข

    useEffect(() => {
        // ดึงข้อมูลโปรไฟล์จาก localStorage
        const storedProfile = JSON.parse(localStorage.getItem('profile')) || {};
        setProfile(storedProfile);
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfile((prevProfile) => ({
            ...prevProfile,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfile((prevProfile) => ({
                    ...prevProfile,
                    profileImage: reader.result,
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        // บันทึกข้อมูลโปรไฟล์ลง localStorage
        localStorage.setItem('profile', JSON.stringify(profile));
        alert('Profile updated successfully!');
        setEditMode(false); // ออกจากโหมดแก้ไข
    };

    const goToRegister = () => {
        navigate('/pets'); // เปลี่ยนไปยังหน้า Register
    };

    const goToLogin = () => {
        navigate('/'); // เปลี่ยนไปยังหน้า Login
    };

    return (
        <div className="profile-container">
            <h2 className="profile-title">โปรไฟล์ของคุณ</h2>
            <div className="image-upload-container">
                {profile.profileImage && (
                    <img 
                        src={profile.profileImage} 
                        alt="Profile" 
                        className="profile-image" 
                    />
                )}
                <label className="change-image-label" htmlFor="profileImageInput">
                    เปลี่ยนรูปโปรไฟล์
                </label>
                <input
                    id="profileImageInput"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="image-upload"
                    style={{ display: 'none' }} // ซ่อน input จริง
                />
            </div>
            <div className="input-container">
                <label>ชื่อ:</label>
                <input 
                    type="text" 
                    name="firstName" 
                    value={profile.firstName} 
                    onChange={handleInputChange} 
                    disabled={!editMode} 
                    className="input-field"
                />
            </div>
            <div className="input-container">
                <label>นามสกุล:</label>
                <input 
                    type="text" 
                    name="lastName" 
                    value={profile.lastName} 
                    onChange={handleInputChange} 
                    disabled={!editMode} 
                    className="input-field"
                />
            </div>
            <div className="input-container">
                <label>อายุ:</label>
                <input 
                    type="number" 
                    name="age" 
                    value={profile.age} 
                    onChange={handleInputChange} 
                    disabled={!editMode} 
                    className="input-field"
                />
            </div>
            <div className="button-container">
                {editMode ? (
                    <button onClick={handleSave} className="save-button">บันทึกโปรไฟล์</button>
                ) : (
                    <button onClick={() => setEditMode(true)} className="edit-button">แก้ไขโปรไฟล์</button>
                )}
                <button onClick={goToRegister} className="pets-button">กลับไปยัง Pets</button>
                <button onClick={goToLogin} className="logout-button">ออกจากระบบ</button> {/* ปุ่ม Logout */}
            </div>
        </div>
    );
};

export default Profile;