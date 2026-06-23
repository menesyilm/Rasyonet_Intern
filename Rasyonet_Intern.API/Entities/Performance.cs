namespace Rasyonet_Intern.API.Entities
{
    public class Performance
    {
        public int Id { get; set; }
        public string UniqueCode { get; set; } = string.Empty;
        public string PerformanceName { get; set; } = string.Empty;
        public decimal Value { get; set; }
        public decimal Price { get; set; }
        public decimal DailyChange { get; set; }
        public decimal WeeklyChange { get; set; }
        public decimal MonthlyChange { get; set; }
        public int CategoryId { get; set; } // Foreign key
        public Category Category { get; set; } = null!; // Navigation property
    }
}