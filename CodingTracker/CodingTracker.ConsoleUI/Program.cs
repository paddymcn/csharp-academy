using CodingTracker.Core;
using CodingTracker.Core.DataModel;
using CodingTracker.Data;
using Microsoft.Extensions.Configuration;
using Spectre.Console;


IConfiguration config = new ConfigurationBuilder()
    .SetBasePath(AppContext.BaseDirectory)
    .AddJsonFile("appsettings.json")
    .Build();

string connectionString = config.GetConnectionString("CodingTracker")
                          ?? throw new InvalidOperationException("Connection string 'CodingTracker' not found in appsettings.json.");

ICodingSessionRepository repo = new SqliteCodingSessionRepository(connectionString);

CodingSession codingSession = new()
{
    Description = "Walking skeleton test",
    StartTime = DateTime.Now.AddHours(-1),
    EndTime = DateTime.Now
};



repo.EnsureCreated();
repo.Add(codingSession);
foreach (CodingSession session in repo.GetAll())
{
    Console.WriteLine($"{session.Id}: {session.StartTime} to {session.EndTime} ({session.Duration})");
}
string text = AnsiConsole.Prompt(
    new TextPrompt<string>($"Enter the start time ({Validation.DateTimeFormat}):")
        .Validate(input => Validation.TryParseDateTime(input, out _)
            ? ValidationResult.Success()
            : ValidationResult.Error($"Use the format {Validation.DateTimeFormat}, e.g. 18/10/2026 14:30")));

