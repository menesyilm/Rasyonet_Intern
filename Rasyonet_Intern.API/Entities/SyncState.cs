namespace Rasyonet_Intern.API.Entities
{
    public class SyncState
    {
        public int Id { get; set; }
        public string JobName { get; set; } = string.Empty;
        public long LastSyncVersion { get; set; }
        public DateTime UpdatedAt{ get; set; } = DateTime.UtcNow;

    }
}
