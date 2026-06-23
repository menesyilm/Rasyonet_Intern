using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Rasyonet_Intern.API.Documents
{
    public class CategoryDocument
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public ObjectId Id { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public List<PerformanceDocument> Performances { get; set; } = new();
    }
}
