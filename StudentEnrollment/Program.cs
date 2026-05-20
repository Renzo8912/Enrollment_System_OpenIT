using StudentEnrollmentEF;
using System.Linq;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

var builder = WebApplication.CreateBuilder(args);

builder.Services.ConfigureHttpJsonOptions(options => 
{
    options.SerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
});

builder.Services.AddDbContext<EnrollmentContext>();
builder.Services.AddAuthorization();
builder.Services.AddIdentityApiEndpoints<IdentityUser>(options => 
{
    options.SignIn.RequireConfirmedAccount = false; 
})
.AddEntityFrameworkStores<EnrollmentContext>();

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

app.UseAuthentication();
app.UseAuthorization();

app.MapPost("/register", async (UserManager<IdentityUser> userManager, [FromBody] AuthRequest req) =>
{
    var user = new IdentityUser { UserName = req.Email, Email = req.Email };
    var result = await userManager.CreateAsync(user, req.Password);
    
    if (result.Succeeded) return Results.Ok();
    return Results.BadRequest(result.Errors);
});

app.MapPost("/login", async (SignInManager<IdentityUser> signInManager, [FromBody] AuthRequest req, [FromQuery] bool? useCookies) =>
{
    var result = await signInManager.PasswordSignInAsync(req.Email, req.Password, isPersistent: true, lockoutOnFailure: false);
    
    if (result.Succeeded) return Results.Ok();
    return Results.Unauthorized();
});

app.MapGet("/api/students", () => 
{
    using var context = new EnrollmentContext();
    return context.Students
        .Include(s => s.Program)
        .Include(s => s.StudentSections)
        .ThenInclude(ss => ss.Section)
        .Include(s => s.StudentGrades)
        .ToList();
});

app.MapPost("/api/students", (Student newStudent) =>
{
    using var context = new EnrollmentContext();
    if (newStudent.Program != null && !string.IsNullOrEmpty(newStudent.Program.ProgramName)) {
        var targetName = newStudent.Program.ProgramName.Trim().ToLower();
        var existingProg = context.Programs.AsEnumerable().FirstOrDefault(p => p.ProgramName.Trim().ToLower() == targetName);
        if (existingProg != null) newStudent.Program = existingProg;
    }
    context.Students.Add(newStudent);
    context.SaveChanges();
    return Results.Created($"/api/students/{newStudent.Id}", newStudent);
}).RequireAuthorization();

app.MapPut("/api/students/{id}", (int id, Student updatedStudent) =>
{
    using var context = new EnrollmentContext();
    var student = context.Students.Include(s => s.Program).Include(s => s.StudentGrades).FirstOrDefault(s => s.Id == id);
    if (student == null) return Results.NotFound();

    student.FirstName = updatedStudent.FirstName;
    student.LastName = updatedStudent.LastName;
    student.Year = updatedStudent.Year;
    student.Gender = updatedStudent.Gender;

    if (updatedStudent.Program != null && !string.IsNullOrEmpty(updatedStudent.Program.ProgramName))
    {
        var targetName = updatedStudent.Program.ProgramName.Trim().ToLower();
        var existingProg = context.Programs.AsEnumerable().FirstOrDefault(p => p.ProgramName.Trim().ToLower() == targetName);
        if (existingProg != null) student.Program = existingProg;
    }

    if (updatedStudent.StudentGrades != null && updatedStudent.StudentGrades.Any())
    {
        var incomingGrade = updatedStudent.StudentGrades.First().Grade;
        if (student.StudentGrades.Any()) student.StudentGrades.First().Grade = incomingGrade;
        else student.StudentGrades.Add(new StudentGrade { Grade = incomingGrade }); 
    }
    context.SaveChanges();
    return Results.Ok(student);
}).RequireAuthorization();

app.MapDelete("/api/students/{id}", (int id) => {
    using var context = new EnrollmentContext();
    var student = context.Students.Find(id);
    if (student == null) return Results.NotFound();
    context.Students.Remove(student);
    context.SaveChanges();
    return Results.Ok(student);
}).RequireAuthorization();

app.MapFallbackToFile("index.html");

app.Run();

public class AuthRequest 
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}