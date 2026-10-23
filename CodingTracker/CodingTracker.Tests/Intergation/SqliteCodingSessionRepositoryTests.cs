using CodingTracker.Core.DataModel;
using CodingTracker.Data;
using Microsoft.Data.Sqlite;

namespace CodingTracker.Tests.Intergation;

public class SqliteCodingSessionRepositoryTests : IDisposable
{
    private readonly string dbPath;
    private readonly SqliteCodingSessionRepository repo;

    public SqliteCodingSessionRepositoryTests()
    {
        dbPath = Path.Combine(Path.GetTempPath(), $"codingtracker_test_{Guid.NewGuid()}.db");
        repo = new SqliteCodingSessionRepository($"Data Source={dbPath}");
        repo.EnsureCreated();
    }

    public void Dispose()
    {
        SqliteConnection.ClearAllPools();
        File.Delete(dbPath);
    }
    
    [Fact]
    public void Add_NewSession_ReturnsSessionWithIdGreaterThanZero()
    {
        // Arrange
        CodingSession session = new()
        {
            StartTime = new DateTime(2026, 10, 9, 9, 0, 0),
            EndTime = new DateTime(2026, 10, 9, 10, 0, 0)
        };

        // Act
        CodingSession result = repo.Add(session);

        // Assert
        Assert.True(result.Id > 0);
    }
}
