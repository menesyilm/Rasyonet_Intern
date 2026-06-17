namespace Rasyonet_Intern.API.DTOs
{
    public class StoreLocationSalesDto
    {
        public string StoreLocation { get; set; } = string.Empty;
        public decimal TotalSales { get; set; }
        public int OrderCount { get; set; }
    }
}
