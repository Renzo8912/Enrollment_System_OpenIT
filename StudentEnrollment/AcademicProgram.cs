namespace StudentEnrollmentEF;

using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

[Table("programs")]
public class AcademicProgram 
{
    [Key] [Column("id")] public int Id { get; set; }
    [Required] [Column("program_name")] public string ProgramName { get; set; }

    public List<Section> Sections { get; set; } = new();
    public List<Student> Students { get; set; } = new();
}