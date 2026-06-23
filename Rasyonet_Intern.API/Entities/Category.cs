namespace Rasyonet_Intern.API.Entities
{
    public class Category
    {
        public int Id { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        // One-to-many navigation property
        public List<Performance> Performances { get; set; } = new();
    }
}