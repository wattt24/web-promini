import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Pets.css';

const PetRecords = () => {
    const navigate = useNavigate();
    const [pets, setPets] = useState([]);
    const [type, setType] = useState('');
    const [name, setName] = useState('');
    const [gender, setGender] = useState('');
    const [age, setAge] = useState('');
    const [editIndex, setEditIndex] = useState(null); // เก็บ index สำหรับการแก้ไข

    useEffect(() => {
        fetchPets();
    }, []);

    const fetchPets = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/pets');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setPets(data);
        } catch (error) {
            console.error('Failed to fetch pets:', error);
            alert('ไม่สามารถดึงข้อมูลสัตว์เลี้ยงได้: ' + error.message);
        }
    };

    const handleAddPet = async (e) => {
        e.preventDefault();

        if (!type || !name || !gender || !age) {
            alert('กรุณากรอกข้อมูลสัตว์เลี้ยงทั้งหมด!');
            return;
        }

        const newPet = { type, name, gender, age };
        if (editIndex !== null) {
            // อัปเดตข้อมูลสัตว์เลี้ยงที่มีอยู่
            const response = await fetch(`http://localhost:5000/api/pets/${pets[editIndex].id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newPet),
            });

            if (response.ok) {
                fetchPets(); // ดึงข้อมูลสัตว์เลี้ยงใหม่
                resetForm(); // ล้างฟอร์ม
            } else {
                alert('เกิดข้อผิดพลาดในการอัปเดตข้อมูล!');
            }
        } else {
            // เพิ่มข้อมูลสัตว์เลี้ยงใหม่
            const response = await fetch('http://localhost:5000/api/pets', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newPet),
            });

            if (response.ok) {
                fetchPets(); // ดึงข้อมูลสัตว์เลี้ยงใหม่
                resetForm(); // ล้างฟอร์ม
            } else {
                alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล!');
            }
        }
    };

    const resetForm = () => {
        setType('');
        setName('');
        setGender('');
        setAge('');
        setEditIndex(null);
    };

    const handleEditPet = (index) => {
        setType(pets[index].type);
        setName(pets[index].name);
        setGender(pets[index].gender);
        setAge(pets[index].age);
        setEditIndex(index);
    };

    const handleDeletePet = async (index) => {
        const confirmDelete = window.confirm('คุณแน่ใจหรือว่าต้องการลบสัตว์เลี้ยงนี้?');
        if (!confirmDelete) return; // ถ้าไม่ยืนยันให้หยุดการทำงาน

        try {
            const petId = pets[index].id; // สมมติว่า API ของคุณต้องการ ID ของสัตว์เลี้ยงเพื่อทำการลบ
            const response = await fetch(`http://localhost:5000/api/pets/${petId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                fetchPets(); // ดึงข้อมูลสัตว์เลี้ยงใหม่
            } else {
                alert('เกิดข้อผิดพลาดในการลบข้อมูล!');
            }
        } catch (error) {
            console.error('Failed to delete pet:', error);
            alert('ไม่สามารถลบข้อมูลสัตว์เลี้ยงได้: ' + error.message);
        }
    };

    const goToDashboard = () => {
        navigate('/dashboard');
    };

    return (
        <div>
            <h2>ระบบบันทึกข้อมูลสัตว์เลี้ยง</h2>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <form onSubmit={handleAddPet}>
            <div>
                <label>ชนิดสัตว์:</label>
                <input 
                    type="text" 
                    value={type} 
                    onChange={(e) => setType(e.target.value)} 
                    required 
                />
            </div>
            <div>
                <label>ชื่อสัตว์:</label>
                <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    required 
                />
            </div>
            <div>
                <label>เพศ:</label>
                <select value={gender} onChange={(e) => setGender(e.target.value)} required>
                    <option value="">เลือกเพศ</option>
                    <option value="ชาย">ชาย</option>
                    <option value="หญิง">หญิง</option>
                </select>
            </div>
            <div>
                <label>อายุ:</label>
                <input 
                    type="number" 
                    value={age} 
                    onChange={(e) => setAge(e.target.value)} 
                    required 
                />
            </div>
            <button type="submit">{editIndex !== null ? 'อัปเดตข้อมูลสัตว์' : 'เพิ่มสัตว์เลี้ยง'}</button>
        </form>

    <ul style={{ listStyleType: 'none', padding: 0, marginLeft: '20px', width: '40%' }}>
        {pets.map((pet, index) => (
            <li key={index}>
                {pet.type} - {pet.name} ({pet.gender}, {pet.age} ปี)
                <button onClick={() => handleEditPet(index)}>แก้ไข</button>
                <button onClick={() => handleDeletePet(index)}>ลบ</button>
            </li>
        ))}
    </ul>

        </div>
            <button id="back-button" onClick={goToDashboard}>กลับไปยัง Dashboard</button>
        </div>
    );
};

export default PetRecords;
