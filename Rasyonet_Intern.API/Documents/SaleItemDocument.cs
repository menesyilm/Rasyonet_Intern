using MongoDB.Bson.Serialization.Attributes;

namespace Rasyonet_Intern.API.Documents
{
    public class SaleItemDocument
    {
        [BsonElement("name")]
        public string Name { get; set; } = string.Empty;

        [BsonElement("tags")]
        public List<string> Tags { get; set; } = new();

        [BsonElement("price")]
        [BsonRepresentation(MongoDB.Bson.BsonType.Decimal128)]
        public decimal Price { get; set; }

        [BsonElement("quantity")]
        public int Quantity { get; set; }
    }
}