namespace StudentEnrollmentEF;

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

[Table("student_sections")]
public class StudentSection
{
    [Key] [Column("id")] public int Id { get; set; }

    [Column("student_id")] public int StudentId { get; set; }
    [ForeignKey("StudentId")] public Student Student { get; set; }

    [Column("section_id")] public int SectionId { get; set; }
    [ForeignKey("SectionId")] public Section Section { get; set; }
}