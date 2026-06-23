namespace Rasyonet_Intern.API.Entities
{
    public class Sale
    {
        public int Id { get; set; }
        public DateTime SaleDate { get; set; }
        public bool CouponUsed { get; set; }
        public string StoreLocation { get; set; } = string.Empty;
        public string PurchaseMethod { get; set; } = string.Empty;
        public List<SaleItem> SaleItems { get; set; } = new(); //Navigation property one-to-many
        public SaleCustomer? SaleCustomer { get; set; } // Navigation property one-to-one
    }
}