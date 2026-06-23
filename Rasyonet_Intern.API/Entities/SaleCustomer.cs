namespace Rasyonet_Intern.API.Entities
{
    public class SaleCustomer
    {
        public int Id { get; set; }
        public int Age { get; set; }
        public string Gender { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Satisfaction { get; set; } = string.Empty;
        public int SaleId { get; set; } // Foreign key
        public Sale Sale { get; set; } = null!; // Navigation property
    }
}