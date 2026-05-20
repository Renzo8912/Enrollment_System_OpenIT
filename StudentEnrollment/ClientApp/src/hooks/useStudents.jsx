import { useState, useEffect } from 'react';
import { getStudents, createStudent, updateStudent, deleteStudent } from '../services/studentService';

export const useStudents = () => {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [programFilter, setProgramFilter] = useState('');
  
  const initialFormState = { id: null, firstName: '', lastName: '', program: 'Computer Science', year: '1', gender: 'Female' };
  const [studentForm, setStudentForm] = useState(initialFormState);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const rawData = await getStudents();
      const cleanData = rawData.map(std => {
          let progName = std.program?.programName || (typeof std.program === 'string' ? std.program : "Unassigned");
          
          let calculatedAvg = 0;
          if (std.studentGrades?.length > 0) {
            const total = std.studentGrades.reduce((sum, g) => sum + Number(g.grade ?? g.Grade ?? 0), 0);
            calculatedAvg = Math.round(total / std.studentGrades.length);
          }

          return { ...std, program: progName, avgGrade: calculatedAvg, status: std.status || 'Enrolled' };
      });
      setStudents(cleanData);
    } catch (error) {
      console.error("Error loading data", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredStudents = students.filter(std => {
    const matchesSearch = `${std.firstName} ${std.lastName}`.toLowerCase().includes(search.toLowerCase());
    const matchesProgram = programFilter === '' || std.program === programFilter;
    return matchesSearch && matchesProgram;
  });

  const stats = {
    total: filteredStudents.length,
    enrolled: filteredStudents.filter(s => s.status === 'Enrolled').length,
    programs: new Set(filteredStudents.map(s => s.program)).size,
    avgGrade: filteredStudents.length > 0 ? Math.round(filteredStudents.reduce((acc, curr) => acc + Number(curr.avgGrade || 85), 0) / filteredStudents.length) : 0
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setStudentForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...studentForm, program: { programName: studentForm.program } };
    try {
        if (studentForm.id) await updateStudent(studentForm.id, payload);
        else await createStudent(payload);
        
        setStudentForm(initialFormState);
        loadData();
    } catch (err) { console.error("CRUD Error:", err); }
  };

  const handleEdit = (std) => {
    setStudentForm(std);
    document.getElementById("add-section")?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this student?")) {
        await deleteStudent(id);
        loadData(); 
    }
  };

  const cancelEdit = () => setStudentForm(initialFormState);

  return {
    isLoading, search, setSearch, programFilter, setProgramFilter,
    studentForm, filteredStudents, stats,
    handleFormChange, handleSubmit, handleEdit, handleDelete, cancelEdit
  };
};