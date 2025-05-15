using hopmate.Server.Data;
using hopmate.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace hopmate.Server.Services
{
	public interface IColorService
	{
		Task<IEnumerable<Color>> GetAllColorsAsync();
		Task<Color> GetColorByIdAsync(int id);
		Task<Color> CreateColorAsync(Color color);
		Task<Color> UpdateColorAsync(Color color);
		Task<bool> DeleteColorAsync(int id);
		Task<bool> ColorExistsAsync(int id);
		Task<bool> ColorNameExistsAsync(string name);
	}

	public class ColorService : IColorService
	{
		private readonly ApplicationDbContext _context;

		public ColorService(ApplicationDbContext context)
		{
			_context = context;
		}

		public async Task<IEnumerable<Color>> GetAllColorsAsync()
		{
			return await _context.Colors.ToListAsync();
		}

		public async Task<Color> GetColorByIdAsync(int id)
		{
			return await _context.Colors.FindAsync(id);
		}

		public async Task<Color> CreateColorAsync(Color color)
		{
			_context.Colors.Add(color);
			await _context.SaveChangesAsync();
			return color;
		}

		public async Task<Color> UpdateColorAsync(Color color)
		{
			_context.Entry(color).State = EntityState.Modified;
			await _context.SaveChangesAsync();
			return color;
		}

		public async Task<bool> DeleteColorAsync(int id)
		{
			var color = await _context.Colors.FindAsync(id);
			if (color == null)
				return false;

			_context.Colors.Remove(color);
			await _context.SaveChangesAsync();
			return true;
		}

		public async Task<bool> ColorExistsAsync(int id)
		{
			return await _context.Colors.AnyAsync(c => c.Id == id);
		}

		public async Task<bool> ColorNameExistsAsync(string name)
		{
			return await _context.Colors.AnyAsync(c => c.Name.ToLower() == name.ToLower());
		}
	}
}