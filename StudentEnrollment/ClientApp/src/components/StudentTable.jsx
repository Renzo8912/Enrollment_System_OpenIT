import { useStudentContext } from '../context/StudentContext';

export const StudentTable = ({ isAuthenticated }) => {
  const { filteredStudents, handleEdit, handleDelete } = useStudentContext();

  if (!filteredStudents || filteredStudents.length === 0) {
    return (
        <div style={{ textAlign: 'center', padding: '2rem', background: '#fff', borderRadius: '10px' }}>
            <p>👎 No students found</p>
        </div>
    );
  }

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Year</th>
            <th>Program</th>
            <th>Avg Grade</th>
            <th>Status</th>
            {isAuthenticated && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map(student => (
            <tr key={student.id}>
              <td>{student.firstName} {student.lastName}</td>
              <td>Year {student.year}</td>
              <td>{student.program || 'Unassigned'}</td>
              <td>{student.avgGrade ? `${student.avgGrade}%` : 'N/A'}</td>
              <td className="status-enrolled">{student.status}</td>
              
              {/* Show Action buttons only if logged in */}
              {isAuthenticated && (
                <td>
                  <button className="btn-edit" onClick={() => handleEdit(student)}>Edit</button>
                  <button className="btn-delete" onClick={() => handleDelete(student.id)} style={{ marginLeft: '0.5rem' }}>Delete</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};