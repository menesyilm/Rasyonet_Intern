using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Rasyonet_Intern.API.Models
{
    public class Sale
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        [BsonElement("saleDate")]
        public DateTime SaleDate { get; set; }

        [BsonElement("items")]
        public List<SaleItem> Items { get; set; } = new();

        [BsonElement("storeLocation")]
        public string StoreLocation { get; set; } = string.Empty;

        [BsonElement("customer")]
        public SaleCustomer Customer { get; set; }

        [BsonElement("couponUsed")]
        public bool CouponUsed { get; set; }

        [BsonElement("purchaseMethod")]
        public string PurchaseMethod { get; set; } = string.Empty;
    }
}