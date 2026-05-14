namespace StudentEnrollmentEF;

using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

[Table("sections")]
public class Section 
{
    [Key] [Column("id")] public int Id { get; set; }
    [Required] [Column("code")] public string Code { get; set; }
    [Column("year")] public int Year { get; set; }

    [Column("program_id")] public int ProgramId { get; set; }
    [ForeignKey("ProgramId")] public AcademicProgram Program { get; set; }

    public List<StudentSection> StudentSections { get; set; } = new();
}