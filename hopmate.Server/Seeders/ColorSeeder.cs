using hopmate.Server.Data;
using hopmate.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace hopmate.Server.Seeders
{
	public static class ColorSeeder
	{
		public static async Task SeedAsync(ApplicationDbContext context)
		{
			if (await context.Colors.AnyAsync())
				return;

			var colors = new List<Color>
			{
				new() { Name = "Black" },
				new() { Name = "White" },
				new() { Name = "Silver" },
				new() { Name = "Gray" },
				new() { Name = "Red" },
				new() { Name = "Blue" },
				new() { Name = "Green" },
				new() { Name = "Yellow" },
				new() { Name = "Orange" },
				new() { Name = "Brown" },
				new() { Name = "Beige" },
				new() { Name = "Gold" },
				new() { Name = "Purple" },
				new() { Name = "Pink" }
			};

			await context.Colors.AddRangeAsync(colors);
			await context.SaveChangesAsync();
		}
	}
}