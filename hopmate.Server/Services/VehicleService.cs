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
		Task<IEnumerable<VehicleDTO>> GetVehiclesByDriverIdAsync(Guid driverId);
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
				.Include(v => v.Driver)
				.Select(v => MapToDTO(v))
				.ToListAsync();
		}

		public async Task<VehicleDTO?> GetVehicleByIdAsync(Guid id)
		{
			var vehicle = await _context.Vehicles
				.Include(v => v.Color)
				.Include(v => v.Driver)
				.FirstOrDefaultAsync(v => v.Id == id);

			return vehicle == null ? null : MapToDTO(vehicle);
		}

		public async Task<IEnumerable<VehicleDTO>> GetVehiclesByDriverIdAsync(Guid driverId)
		{
			return await _context.Vehicles
				.Include(v => v.Color)
				.Include(v => v.Driver)
				.Where(v => v.IdDriver == driverId)
				.Select(v => MapToDTO(v))
				.ToListAsync();
		}

		public async Task<VehicleDTO> CreateVehicleAsync(CreateVehicleDTO vehicleDto)
		{
			var vehicle = new Vehicle
			{
				Id = Guid.NewGuid(),
				Brand = vehicleDto.Brand,
				Model = vehicleDto.Model,
				Plate = vehicleDto.Plate,
				Seats = vehicleDto.Seats,
				ImageFilePath = vehicleDto.ImageFilePath ?? string.Empty,
				IdDriver = vehicleDto.IdDriver,
				IdColor = vehicleDto.IdColor,
				Color = await _context.Colors.FindAsync(vehicleDto.IdColor)
					?? throw new InvalidOperationException("Color not found"),
				Driver = await _context.Drivers.FindAsync(vehicleDto.IdDriver)
					?? throw new InvalidOperationException("Driver not found")
			};

			_context.Vehicles.Add(vehicle);
			await _context.SaveChangesAsync();

			return MapToDTO(vehicle);
		}

		public async Task<VehicleDTO?> UpdateVehicleAsync(Guid id, UpdateVehicleDTO vehicleDto)
		{
			var vehicle = await _context.Vehicles
				.Include(v => v.Color)
				.Include(v => v.Driver)
				.FirstOrDefaultAsync(v => v.Id == id);

			if (vehicle == null)
				return null;

			vehicle.Brand = vehicleDto.Brand;
			vehicle.Model = vehicleDto.Model;
			vehicle.Plate = vehicleDto.Plate;
			vehicle.Seats = vehicleDto.Seats;
			vehicle.ImageFilePath = vehicleDto.ImageFilePath ?? vehicle.ImageFilePath;
			vehicle.IdColor = vehicleDto.IdColor;

			// Update related entities if needed
			vehicle.Color = await _context.Colors.FindAsync(vehicleDto.IdColor)
				?? throw new InvalidOperationException("Color not found");

			await _context.SaveChangesAsync();
			return MapToDTO(vehicle);
		}

		public async Task<bool> DeleteVehicleAsync(Guid id)
		{
			var vehicle = await _context.Vehicles.FindAsync(id);
			if (vehicle == null)
				return false;

			_context.Vehicles.Remove(vehicle);
			await _context.SaveChangesAsync();
			return true;
		}

		private static VehicleDTO MapToDTO(Vehicle vehicle)
		{
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
				ColorName = vehicle.Color?.Name,
				DriverName = vehicle.Driver?.User?.FullName
			};
		}
	}
}