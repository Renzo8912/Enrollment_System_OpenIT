import { useStudentContext } from '../context/StudentContext';

export const StudentForm = () => {
    const {
        studentForm,
        handleFormChange,
        handleSubmit,
        cancelEdit
    } = useStudentContext();

      return (
    <section id="add-section" className="add-container">
      <h2>{studentForm.id ? "Edit Student" : "Add a New Student"}</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          
          <div className="form-group">
            <label>First Name</label>
            <input 
              required 
              type="text" 
              name="firstName" 
              value={studentForm.firstName} 
              onChange={handleFormChange} 
            />
          </div>

          <div className="form-group">
            <label>Last Name</label>
            <input 
              required 
              type="text" 
              name="lastName" 
              value={studentForm.lastName} 
              onChange={handleFormChange} 
            />
          </div>

          <div className="form-group">
            <label>Program</label>
            <select name="program" value={studentForm.program} onChange={handleFormChange}>
              <option value="Computer Science">Computer Science</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Information Systems">Information Systems</option>
              <option value="Tourism">Tourism</option>
              <option value="Business Administration">Business Administration</option>
            </select>
          </div>

          <div className="form-group">
            <label>Year</label>
            <select name="year" value={studentForm.year} onChange={handleFormChange}>
              <option value="1">Year 1</option>
              <option value="2">Year 2</option>
              <option value="3">Year 3</option>
              <option value="4">Year 4</option>
            </select>
          </div>

          <div className="form-group">
            <label>Gender</label>
            <select name="gender" value={studentForm.gender} onChange={handleFormChange}>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div className="form-group">
            <label>Grade</label>
              <input 
                type="number" 
                name="grade" 
                placeholder="e.g. 85"
                value={studentForm.grade || ''} 
                onChange={handleFormChange} 
              />
          </div>

        </div>

        <button className="btn-submit" type="submit">
            {studentForm.id ? "Update Student" : "Add Student"}
        </button>

        {studentForm.id && (
            <button 
              type="button" 
              onClick={cancelEdit} 
              style={{marginTop: '1rem', width: '100%', padding: '0.8rem', cursor: 'pointer', background: '#e0e0e0', color: '#333', border: 'none', borderRadius: '8px', fontWeight: 'bold'}}
            >
                Cancel Edit
            </button>
        )}
      </form>
    </section>
  );
};
