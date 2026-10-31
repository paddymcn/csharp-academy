using System.Globalization;
namespace CodingTracker.Console;




// No Spectre.Console here on purpose: string in, answer out.
// That keeps it unit-testable and reusable from an Avalonia/WPF front end.
public class Validator
{
    public const string DateFormat = "dd-MM-yy"; // MM = month, mm = minutes
    public const string TimeFormat = "HH:mm"; // HH = 24-hour clock, hh = 12-hour
    public const string DateTimeFormat = "dd/MM/yyyy HH:mm";

    internal static bool IsValidTime(string? input, string format, out TimeOnly time)
    {
        return TimeOnly.TryParseExact(
            input?.Trim(),
            format,
            CultureInfo.InvariantCulture,
            DateTimeStyles.None,
            out time);
    }
    
    public static bool TryParseDateTime(string? input, out DateTime result)
    {
        return DateTime.TryParseExact(
            input,
            DateTimeFormat,
            CultureInfo.InvariantCulture,
            DateTimeStyles.None,
            out result);
    }
    public static bool IsValidDate(string? input, string format, out DateTime date)
    {
        return DateTime.TryParseExact(
            input?.Trim(),
            format,
            CultureInfo.InvariantCulture,
            DateTimeStyles.None,
            out date);
    }

    // Positive means 1 or more. Change to >= 0 if zero is a valid value for you.
    public static bool IsValidPositiveInt(string? input, out int number)
    {
        return int.TryParse(input, NumberStyles.Integer, CultureInfo.InvariantCulture, out number)
               && number > 0;
    }

    public static bool IsValidName(string? input, int maxLength = 50)
    {
        return !string.IsNullOrWhiteSpace(input)
               && input.Trim().Length <= maxLength;
    }
}