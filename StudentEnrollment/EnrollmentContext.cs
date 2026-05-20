namespace StudentEnrollmentEF;


using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

public class EnrollmentContext : IdentityDbContext<IdentityUser>
{
    public DbSet<AcademicProgram> Programs { get; set; }
    public DbSet<Section> Sections { get; set; }
    public DbSet<Student> Students { get; set; }
    public DbSet<StudentSection> StudentSections { get; set; }
    public DbSet<StudentGrade> StudentGrades { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseNpgsql("Host=localhost;Port=5432;Database=postgres;Username=postgres;Password=ccms");
    }

}