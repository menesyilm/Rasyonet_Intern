namespace Rasyonet_Intern.API.DTOs
{
    public class PurchaseMethodDistributionDto
    {
        public string PurchaseMethod { get; set; } = string.Empty;
        public decimal TotalSales { get; set; }
        public int OrderCount { get; set; }
    }
}
