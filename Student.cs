namespace StudentEnrollmentEF;

using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

[Table("students")] 
public class Student
{
    [Key] [Column("id")] public int Id { get; set; }
    [Required] [Column("first_name")] public string FirstName { get; set; }
    [Required] [Column("last_name")] public string LastName { get; set; }
    [Column("year")] public int Year { get; set; }
    [Column("gender")] public string Gender { get; set; }
    [Column("enrolled")] public bool Enrolled { get; set; } = true;

    [Column("program_id")] public int? ProgramId { get; set; }
    [ForeignKey("ProgramId")] public AcademicProgram Program { get; set; }

    public List<StudentSection> StudentSections { get; set; } = new();
    public List<StudentGrade> StudentGrades { get; set; } = new();

}