using StudentEnrollmentEF;
using System.Linq;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
});

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

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

app.Run();