using MDF.BusinessLayer.Data;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MDF.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20261014153000_cliente-data-nascita")]
    public partial class clientedatanascita : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateOnly>(
                name: "DataNascita",
                table: "Clienti",
                type: "date",
                nullable: false,
                defaultValue: new DateOnly(1900, 1, 1));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DataNascita",
                table: "Clienti");
        }
    }
}
