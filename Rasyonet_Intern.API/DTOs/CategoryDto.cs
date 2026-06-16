namespace Rasyonet_Intern.API.DTOs
{
    public class CategoryDto
    {
        public string CategoryId { get; set; } = string.Empty;
        public string CategoryName { get; set; } = string.Empty;

        public List<PerformanceDto> Performances { get; set; } = new();
    }
}