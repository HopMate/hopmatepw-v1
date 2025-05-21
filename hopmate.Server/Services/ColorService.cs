// ColorService.cs
using hopmate.Server.Data;
using hopmate.Server.DTO;
using hopmate.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace hopmate.Server.Services
{
	public interface IColorService
	{
		Task<IEnumerable<ColorDto>> GetAllColorsAsync();
		Task<ColorDto?> GetColorByIdAsync(int id);
		Task<ColorDto> CreateColorAsync(CreateColorDto colorDto);
		Task<ColorDto?> UpdateColorAsync(UpdateColorDto colorDto);
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

		public async Task<IEnumerable<ColorDto>> GetAllColorsAsync()
		{
			return await _context.Colors
				.Select(c => new ColorDto { Id = c.Id, Name = c.Name })
				.ToListAsync();
		}

		public async Task<ColorDto?> GetColorByIdAsync(int id)
		{
			var color = await _context.Colors.FindAsync(id);
			if (color == null)
				return null;

			return new ColorDto { Id = color.Id, Name = color.Name };
		}

		public async Task<ColorDto> CreateColorAsync(CreateColorDto colorDto)
		{
			var color = new Color { Name = colorDto.Name };
			_context.Colors.Add(color);
			await _context.SaveChangesAsync();

			return new ColorDto { Id = color.Id, Name = color.Name };
		}

		public async Task<ColorDto?> UpdateColorAsync(UpdateColorDto colorDto)
		{
			var color = await _context.Colors.FindAsync(colorDto.Id);
			if (color == null)
				return null;

			color.Name = colorDto.Name;
			_context.Entry(color).State = EntityState.Modified;
			await _context.SaveChangesAsync();

			return new ColorDto { Id = color.Id, Name = color.Name };
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