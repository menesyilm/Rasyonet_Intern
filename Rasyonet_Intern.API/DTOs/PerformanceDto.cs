namespace Rasyonet_Intern.API.DTOs
{
    public class PerformanceDto
    {
        public string UniqueCode { get; set; } = string.Empty;
        public string PerformanceName { get; set; } = string.Empty;
        public decimal Value { get; set; }
        public decimal Price { get; set; }
        public decimal DailyChange { get; set; }
        public decimal WeeklyChange { get; set; }
        public decimal MonthlyChange { get; set; }
    }
}
