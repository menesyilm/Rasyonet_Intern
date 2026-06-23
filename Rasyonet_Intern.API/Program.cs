using Microsoft.EntityFrameworkCore;
using MongoDB.Driver;
using MongoDB.Driver.Core.Extensions.DiagnosticSources;
using OpenTelemetry.Exporter;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;
using Rasyonet_Intern.API.Data;
using Rasyonet_Intern.API.Data.Sql;
using Rasyonet_Intern.API.Repositories.Implementations;
using Rasyonet_Intern.API.Repositories.Interfaces;
using Rasyonet_Intern.API.Service;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
//Sql Connection
builder.Services.AddDbContext<AppDbContext>(options =>
{
    var connectionString = builder.Configuration["SqlDbSettings:ConnectionString"];

    options.UseSqlServer(connectionString);
});
//MongoDB Bağlantısı
//MongoClient'i düz oluşturmak yerine OpenTelemetry'nin MongoDB'yi izleyebilmesi için
//DiagnosticsActivityEventSubscriber kullanarak MongoClientSettings oluşturuyoruz.
var mongoClientSettings = MongoClientSettings.FromConnectionString(
    builder.Configuration["MongoDbSettings:ConnectionString"]);

mongoClientSettings.ClusterConfigurator = cb =>
{
    cb.Subscribe(new DiagnosticsActivityEventSubscriber());
};

var mongoClient = new MongoClient(mongoClientSettings);

var database = mongoClient.GetDatabase(
    builder.Configuration["MongoDbSettings:DatabaseName"]);

builder.Services.AddSingleton<IMongoDatabase>(database);
builder.Services.AddSingleton<MongoDbContext>();
//AutoMapper
builder.Services.AddAutoMapper(cfg => { }, typeof(Program).Assembly);
// Repositories
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<ISaleRepository, SaleRepository>();
// MemoryCache
builder.Services.AddMemoryCache();
builder.Services.AddScoped<CacheService>();
// CORS ayarları
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});
// OpenTelemetry
builder.Services.AddOpenTelemetry()
    .WithTracing(tracing => tracing
        .SetResourceBuilder(
            ResourceBuilder.CreateDefault()
                .AddService("Rasyonet_Intern.API"))
        .AddAspNetCoreInstrumentation()
        .AddHttpClientInstrumentation()
        .AddSource("MongoDB.Driver.Core.Extensions.DiagnosticSources")
        .AddOtlpExporter(opt =>
        {
            opt.Endpoint = new Uri("http://localhost:4317");
            opt.Protocol = OtlpExportProtocol.Grpc;
        }));
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowReactApp");

app.UseAuthorization();

app.MapControllers();

app.Run();
