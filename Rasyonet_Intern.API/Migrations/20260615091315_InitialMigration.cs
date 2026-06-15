using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Rasyonet_Intern.API.Migrations
{
    /// <inheritdoc />
    public partial class InitialMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "fonKategoriler",
                columns: table => new
                {
                    FonKategoriId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    KategoriAdi = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_fonKategoriler", x => x.FonKategoriId);
                });

            migrationBuilder.CreateTable(
                name: "fonPerformanslar",
                columns: table => new
                {
                    FonPerformansId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FonKodu = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FonAdi = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Buyukluk = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Fiyat = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    GunlukDegisimYuzde = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    HaftalikDegisimYuzde = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    AylikDegisimYuzde = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    FonKategoriId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_fonPerformanslar", x => x.FonPerformansId);
                    table.ForeignKey(
                        name: "FK_fonPerformanslar_fonKategoriler_FonKategoriId",
                        column: x => x.FonKategoriId,
                        principalTable: "fonKategoriler",
                        principalColumn: "FonKategoriId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_fonPerformanslar_FonKategoriId",
                table: "fonPerformanslar",
                column: "FonKategoriId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "fonPerformanslar");

            migrationBuilder.DropTable(
                name: "fonKategoriler");
        }
    }
}
