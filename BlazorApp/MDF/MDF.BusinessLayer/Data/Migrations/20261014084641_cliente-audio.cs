using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MDF.Migrations
{
    /// <inheritdoc />
    public partial class clienteaudio : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "PdfFileName",
                table: "Clienti",
                type: "nvarchar(260)",
                maxLength: 260,
                nullable: true);

            migrationBuilder.CreateTable(
                name: "ClienteAudioTracks",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ClienteId = table.Column<int>(type: "int", nullable: false),
                    FileName = table.Column<string>(type: "nvarchar(260)", maxLength: 260, nullable: false),
                    Titolo = table.Column<string>(type: "nvarchar(160)", maxLength: 160, nullable: false),
                    Ordine = table.Column<int>(type: "int", nullable: false),
                    CreatedUtc = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedUtc = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ClienteAudioTracks", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ClienteAudioTracks_Clienti_ClienteId",
                        column: x => x.ClienteId,
                        principalTable: "Clienti",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ClienteAudioTracks_ClienteId_FileName",
                table: "ClienteAudioTracks",
                columns: new[] { "ClienteId", "FileName" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ClienteAudioTracks_ClienteId_Ordine",
                table: "ClienteAudioTracks",
                columns: new[] { "ClienteId", "Ordine" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ClienteAudioTracks");

            migrationBuilder.DropColumn(
                name: "PdfFileName",
                table: "Clienti");
        }
    }
}
