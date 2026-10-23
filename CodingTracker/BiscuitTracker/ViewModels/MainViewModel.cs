using BiscuitTracker.ViewModels;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;

namespace BiscuitTracker.ViewModels;

public partial class MainViewModel : ViewModelBase
{
    // The toolkit turns this into a public CountText property the screen is bound to
    [ObservableProperty] private string countText = "0 biscuits";

    // Just remembers the number. The screen never sees this directly.
    private int count;

    [RelayCommand]
    private void AddBiscuit()
    {
        count++;
        UpdateCountText();
    }

    [RelayCommand]
    private void Reset()
    {
        count = 0;
        UpdateCountText();
    }

    private void UpdateCountText()
    {
        // Capital C: setting the property is what tells the screen to update
        CountText = $"{count} biscuits";
    }
}