using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Rasyonet_Intern.API.Documents
{
    public class SaleDocument
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("saleDate")]
        public DateTime SaleDate { get; set; }

        [BsonElement("items")]
        public List<SaleItemDocument> Items { get; set; } = new();

        [BsonElement("storeLocation")]
        public string StoreLocation { get; set; } = string.Empty;

        [BsonElement("customer")]
        public SaleCustomerDocument Customer { get; set; } = new SaleCustomerDocument();

        [BsonElement("couponUsed")]
        public bool CouponUsed { get; set; }

        [BsonElement("purchaseMethod")]
        public string PurchaseMethod { get; set; } = string.Empty;

        //MSSQL'den MongoDB'ye yazarken duplicate olmaması için.
        [BsonElement("sqlId")]
        public int SqlId { get; set; }
    }
}