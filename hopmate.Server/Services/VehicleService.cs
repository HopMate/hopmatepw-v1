using hopmate.Server.Data;
using hopmate.Server.DTO;
using hopmate.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace hopmate.Server.Services
{
	public interface IVehicleService
	{
		Task<IEnumerable<VehicleDTO>> GetAllVehiclesAsync();
		Task<VehicleDTO?> GetVehicleByIdAsync(Guid id);
		Task<VehicleDTO> CreateVehicleAsync(CreateVehicleDTO vehicleDto);
		Task<VehicleDTO?> UpdateVehicleAsync(Guid id, UpdateVehicleDTO vehicleDto);
		Task<bool> DeleteVehicleAsync(Guid id);
	}

	public class VehicleService : IVehicleService
	{
		private readonly ApplicationDbContext _context;

		public VehicleService(ApplicationDbContext context)
		{
			_context = context;
		}

		public async Task<IEnumerable<VehicleDTO>> GetAllVehiclesAsync()
		{
			return await _context.Vehicles
				.Include(v => v.Color)
				.Select(v => new VehicleDTO
				{
					Id = v.Id,
					Brand = v.Brand,
					Model = v.Model,
					Plate = v.Plate,
					Seats = v.Seats,
					ImageFilePath = v.ImageFilePath,
					IdDriver = v.IdDriver,
					IdColor = v.IdColor,
					ColorName = v.Color!.Name
				}).ToListAsync();
		}

		public async Task<VehicleDTO?> GetVehicleByIdAsync(Guid id)
		{
			var vehicle = await _context.Vehicles
				.Include(v => v.Color)
				.FirstOrDefaultAsync(v => v.Id == id);

			if (vehicle == null) return null;

			return new VehicleDTO
			{
				Id = vehicle.Id,
				Brand = vehicle.Brand,
				Model = vehicle.Model,
				Plate = vehicle.Plate,
				Seats = vehicle.Seats,
				ImageFilePath = vehicle.ImageFilePath,
				IdDriver = vehicle.IdDriver,
				IdColor = vehicle.IdColor,
				ColorName = vehicle.Color!.Name
			};
		}

		public async Task<VehicleDTO> CreateVehicleAsync(CreateVehicleDTO dto)
		{
			var vehicle = new Vehicle
			{
				Id = Guid.NewGuid(),
				Brand = dto.Brand,
				Model = dto.Model,
				Plate = dto.Plate,
				Seats = dto.Seats,
				ImageFilePath = dto.ImageFilePath,
				IdDriver = dto.IdDriver,
				IdColor = dto.IdColor
			};

			_context.Vehicles.Add(vehicle);
			await _context.SaveChangesAsync();

			return await GetVehicleByIdAsync(vehicle.Id) ?? throw new Exception("Vehicle not found after creation.");
		}

		public async Task<VehicleDTO?> UpdateVehicleAsync(Guid id, UpdateVehicleDTO dto)
		{
			var vehicle = await _context.Vehicles.FindAsync(id);
			if (vehicle == null) return null;

			vehicle.Brand = dto.Brand;
			vehicle.Model = dto.Model;
			vehicle.Plate = dto.Plate;
			vehicle.Seats = dto.Seats;
			vehicle.ImageFilePath = dto.ImageFilePath;
			vehicle.IdDriver = dto.IdDriver;
			vehicle.IdColor = dto.IdColor;

			await _context.SaveChangesAsync();

			return await GetVehicleByIdAsync(id);
		}

		public async Task<bool> DeleteVehicleAsync(Guid id)
		{
			var vehicle = await _context.Vehicles.FindAsync(id);
			if (vehicle == null) return false;

			_context.Vehicles.Remove(vehicle);
			await _context.SaveChangesAsync();
			return true;
		}
	}
}