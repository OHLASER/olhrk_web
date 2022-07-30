[string]$os_str = (Get-WmiObject Win32_OperatingSystem).Properties["caption"].value

if ($os_str.IndexOf("Microsoft Windows 10") -eq -1)
{
    Write-Host "error: required windows 10 or later."
} 
else
{
    Enable-WindowsOptionalFeature -Online -FeatureName IIS-ManagementConsole,`
        IIS-ManagementService,`
        IIS-ManagementScriptingTools,`
        IIS-NetFxExtensibility45,`
        IIS-ASP,`
        IIS-ASPNET45,`
        IIS-CGI,`
        IIS-ISAPIExtensions,`
        IIS-ISAPIFilter,`
        IIS-DefaultDocument,`
        IIS-DirectoryBrowsing,`
        IIS-HttpErrors,`
        IIS-StaticContent,`
        IIS-RequestFiltering
}

Read-Host "done"
