namespace StudentEnrollmentEF;

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

[Table("student_grades")]
public class StudentGrade
{
    [Key] [Column("id")] public int Id { get; set; }

    [Column("student_id")] public int StudentId { get; set; }
    [ForeignKey("StudentId")] public Student Student { get; set; }

    [Column("grade")] public decimal Grade { get; set; }
}