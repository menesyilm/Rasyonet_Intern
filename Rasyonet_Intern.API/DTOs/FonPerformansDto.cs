namespace Rasyonet_Intern.API.DTOs
{
    public class FonPerformansDto
    {
        public int FonPerformansId { get; set; }
        public string FonKodu { get; set; } = string.Empty;
        public string FonAdi { get; set; } = string.Empty;
        public decimal Buyukluk { get; set; }
        public decimal Fiyat { get; set; }
        public decimal GunlukDegisimYuzde { get; set; }
        public decimal HaftalikDegisimYuzde { get; set; }
        public decimal AylikDegisimYuzde { get; set; }
        public string KategoriAdi { get; set; } = string.Empty;
    }
}
