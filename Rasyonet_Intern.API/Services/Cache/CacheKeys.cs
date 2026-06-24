namespace Rasyonet_Intern.API.Service
{
    public static class CacheKeys
    {
        // Typo önlenmesi için sabitler kullanılıyor. Bu sayede cache key'leri yanlış yazma riskini azaltıyoruz.
        public const string StoreLocationChart = "StoreLocationChart";
        public const string PurchaseMethodChart = "PurchaseMethodChart";
        public const string MonthlyTrendChart = "MonthlyTrendChart";

        // Sales collection'ı değiştiğinde temizlenmesi gereken
        // tüm satış chart cache key'lerini tek listede toplar.
        //
        // Neden gerekli?
        // MongoDB'de Sales collection değiştiğinde sadece bir cache değil,
        // Sales verisine bağlı bütün chart cache'leri artık bayat hale gelir.
        //
        // Örneğin Sales değişirse şunların hepsi etkilenebilir:
        // - StoreLocationChart
        // - PurchaseMethodChart
        // - MonthlyTrendChart
        //
        // Bu yüzden CacheInvalidationService bu listeyi kullanarak
        // Sales ile ilişkili tüm cache'leri temizleyebilir.
        public static readonly IReadOnlyList<string> SalesChartKeys =
        [
            StoreLocationChart,
            PurchaseMethodChart,
            MonthlyTrendChart
        ];
    }
}
