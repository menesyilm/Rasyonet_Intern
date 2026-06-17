using MongoDB.Driver;
using Rasyonet_Intern.API.Controllers;
using Rasyonet_Intern.API.Data;
using Rasyonet_Intern.API.Repositories.Implementations;
using Rasyonet_Intern.API.Repositories.Interfaces;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
//MongoDB Bağlantısı
var mongoClient = new MongoClient(
    builder.Configuration["MongoDbSettings:ConnectionString"]);

var database = mongoClient.GetDatabase(
    builder.Configuration["MongoDbSettings:DatabaseName"]);

builder.Services.AddSingleton<IMongoDatabase>(database);
builder.Services.AddSingleton<MongoDbContext>();
//AutoMapper
builder.Services.AddAutoMapper(cfg => { }, typeof(Program).Assembly);
// Repositories
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<ISaleRepository, SaleRepository>();
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
