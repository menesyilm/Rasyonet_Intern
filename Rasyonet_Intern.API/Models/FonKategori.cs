namespace Rasyonet_Intern.API.Models
{
    public class FonKategori
    {
        public int FonKategoriId { get; set; }
        public string KategoriAdi { get; set; } = String.Empty;
        public List<FonPerformans> FonPerformanslar { get; set; }
    }
}
