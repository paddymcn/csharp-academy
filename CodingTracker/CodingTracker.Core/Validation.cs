using System.Globalization;

namespace CodingTracker.Core;

public class Validation
{
    public const string DateTimeFormat = "dd/MM/yyyy HH:mm";
    public static bool TryParseDateTime(string? input, out DateTime result)
    {
        return DateTime.TryParseExact(
            input,
            DateTimeFormat,
            CultureInfo.InvariantCulture,
            DateTimeStyles.None,
            out result);
    }
}