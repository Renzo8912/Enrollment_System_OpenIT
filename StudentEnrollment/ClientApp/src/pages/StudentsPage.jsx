import { useStudentContext } from '../context/StudentContext';
import { StudentTable } from '../components/StudentTable';
import { StudentForm } from '../components/StudentForm';

export const StudentsPage = ({ isAuthenticated }) => {
  const { search, setSearch, programFilter, setProgramFilter, stats } = useStudentContext();

  return (
    <main className="container">
      {/* Stats Bar */}
      <div className="stats-bar">
        <div className="stat-item"><span className="stat-value">{stats.total}</span><span className="stat-label">Total Student</span></div><div className="stat-divider"></div>
        <div className="stat-item"><span className="stat-value">{stats.enrolled}</span><span className="stat-label">Enrolled</span></div><div className="stat-divider"></div>
        <div className="stat-item"><span className="stat-value">{stats.programs}</span><span className="stat-label">Programs</span></div><div className="stat-divider"></div>
        <div className="stat-item"><span className="stat-value">{stats.avgGrade > 0 ? `${stats.avgGrade}%` : 'N/A'}</span><span className="stat-label">Avg Grade</span></div>
      </div>

      {/* Search and Filter */}
      <div className="controls-bar">
        <div className="search-wrapper">
          <input type="search" placeholder="🔍 Search..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="filter-wrapper">
          <select value={programFilter} onChange={e => setProgramFilter(e.target.value)}>
            <option value="">All Programs</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Information Technology">Information Technology</option>
            <option value="Information Systems">Information Systems</option>
            <option value="Tourism">Tourism</option>
            <option value="Business Administration">Business Administration</option>
          </select>
        </div>
      </div>

      {/* The Table gets the security state */}
      <StudentTable isAuthenticated={isAuthenticated} />
      
      {/* The Form is ONLY visible if logged in */}
      {isAuthenticated && <StudentForm />}
    </main>
  );
};