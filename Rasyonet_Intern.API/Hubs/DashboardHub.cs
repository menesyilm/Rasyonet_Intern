using Microsoft.AspNetCore.SignalR;

namespace Rasyonet_Intern.API.Hubs
{
    // DashboardHub, SignalR bağlantılarının bağlandığı merkezdir.
    // Frontend tarafı bu Hub'a bağlanır.
    // Backend tarafı da bu Hub üzerinden bağlı client'lara mesaj gönderir.
    // Örneğin:
    // React dashboard sayfası açıldığında bu Hub'a bağlanır.
    // MongoDB'de Sales değişince backend bu Hub üzerinden frontend'e haber verir.
    public class DashboardHub : Hub
    {
    }
}