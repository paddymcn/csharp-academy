using CodingTracker.Core.DataModel;


namespace CodingTracker.Tests.Unit;

public class CodingSessionTests
{
    [Fact]
    public void Duration_NormalSession_ReturnsDifferenceBetweenEndAndStart()
    {
        //Arrange
        CodingSession codingSession = new()
        {
            StartTime = new DateTime(2026, 10, 9, 9, 0, 0),
            EndTime = new DateTime(2026, 10, 9, 10, 30, 0)
        };
        TimeSpan expected =  TimeSpan.FromMinutes(90);

        //Act
        TimeSpan actual = codingSession.Duration;

        //Assert
        Assert.Equal(expected, actual);
    }
    /* example below of inline tests
    [Theory]
    [InlineData(2, 3, 5)]
    [InlineData(10, 5, 15)]
    [InlineData(10, 5, 15)]
    public void Add_ReturnsSum(int a, int b, int expected)
    {
    }
    */ 
    
    [Theory]
    [InlineData(9, 10, 30, 0, 90)]   // 09:00 to 10:30 same day, expecting 90
    [InlineData(9, 9, 0, 0, 0)]      // 09:00 to 09:00 same day, expecting 0
    [InlineData(9, 8, 0, 0, -60)]    // 09:00 to 08:00 same day, expecting -60
    [InlineData(23, 0, 30, 1, 90)]   // 23:00 to 00:30 next day, expecting 90
    public void Duration_ReturnsEndMinusStart(
        int startHour, int endHour, int endMinute, int endDayOffset, int expectedMinutes)
    {
        // Arrange
        CodingSession codingSession = new()
        {
            StartTime = new DateTime(2026, 10, 31, startHour, 0, 0),
            EndTime = new DateTime(2026, 10, 31, endHour, endMinute, 0).AddDays(endDayOffset)
        };
        TimeSpan expected = TimeSpan.FromMinutes(expectedMinutes);

        // Act
        TimeSpan actual = codingSession.Duration;

        // Assert
        Assert.Equal(expected, actual);
    }




}