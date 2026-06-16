using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Rasyonet_Intern.API.Models
{
    public class Category
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public ObjectId Id { get; set; }
        public string CategoryName { get; set; } = string.Empty;
         public List<Performance> Performances { get; set; } = new();
    }
}
