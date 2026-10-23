using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;

namespace AvaloniaApplicationTestBed.ViewModels;

public partial class MainViewModel : ViewModelBase
{
    // Each [ObservableProperty] field becomes a public property that
    // tells the window when it changes (e.g. startText -> StartText)
    [ObservableProperty] private string countText = "0 biscuits";
    private int biscuitCount;

    // [RelayCommand] turns each method into a command: AddBiscuit() becomes AddBiscuitCommand
    [RelayCommand]
    private void AddBiscuit()
    {
        // TODO: what should happen when the "Ate One" button is clicked?
        biscuitCount++;
        UpdateCountText();
    }

    [RelayCommand]
    private void Reset()
    {
        // TODO: what should happen when the "Reset" button is clicked?
        biscuitCount = 0;
        UpdateCountText();
    }
    // One place that turns the number into text (DRY: both buttons use it)
    private void UpdateCountText()
    {
        CountText = $"{biscuitCount} biscuits";
    }
}