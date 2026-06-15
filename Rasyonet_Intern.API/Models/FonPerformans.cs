namespace Rasyonet_Intern.API.Models
{
    public class FonPerformans
    {
        public int FonPerformansId { get; set; }
        public string FonKodu { get; set; } = string.Empty;
        public string FonAdi { get; set; } = string.Empty;
        public decimal Buyukluk { get; set; }
        public decimal Fiyat { get; set; }
        public decimal GunlukDegisimYuzde { get; set; }
        public decimal HaftalikDegisimYuzde { get; set; }
        public decimal AylikDegisimYuzde { get; set; }

        //Fon KategoriId, FonKategori ile ilişkilendirme yapmak için kullanılır. Bu sayede her fon performansı belirli bir kategoriye ait olabilir.
        public int FonKategoriId { get; set; }
        public FonKategori FonKategori { get; set; } // Navigation property
    }
}
