namespace Rasyonet_Intern.API.DTOs
{
    public class MonthlySalesTrendDto
    {
        public int Year { get; set; }
        public int Month { get; set; }
        public string Period { get; set; } = string.Empty; // Format: "YYYY-MM"
        public decimal TotalSales { get; set; }
        public int OrderCount { get; set; }
    }
}
