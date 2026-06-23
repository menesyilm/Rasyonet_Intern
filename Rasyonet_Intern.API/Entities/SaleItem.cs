namespace Rasyonet_Intern.API.Entities
{
    public class SaleItem
    {
        public int Id { get; set; }
        public int SaleId { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Tags { get; set; } = string.Empty;
        public Sale Sale { get; set; } = null!; // Navigation property
    }
}