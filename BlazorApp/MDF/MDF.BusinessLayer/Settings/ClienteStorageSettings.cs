namespace MDF.BusinessLayer.Settings;

public class ClienteStorageSettings
{
    public string RootPath { get; set; } = Path.Combine("App_Data", "Clienti");
}
