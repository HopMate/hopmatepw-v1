// VehicleService.cs
using hopmate.Server.Data;
using hopmate.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace hopmate.Server.Services
{
	public interface IVehicleService
	{
		Task<List<Vehicle>> GetAllVehiclesAsync();
		Task<Vehicle?> GetVehicleByIdAsync(Guid id);
		Task<Vehicle> CreateVehicleAsync(Vehicle vehicle);
		Task<Vehicle?> UpdateVehicleAsync(Guid id, Vehicle vehicle);
		Task<bool> DeleteVehicleAsync(Guid id);
		Task<List<Vehicle>> GetVehiclesByDriverAsync(Guid driverId);
	}

	public class VehicleService : IVehicleService
	{
		private readonly ApplicationDbContext _context;

		public VehicleService(ApplicationDbContext context)
		{
			_context = context;
		}

		public async Task<List<Vehicle>> GetAllVehiclesAsync()
		{
			return await _context.Vehicles
				.Include(v => v.Color)
				.Include(v => v.Driver)
				.ToListAsync();
		}

		public async Task<Vehicle?> GetVehicleByIdAsync(Guid id)
		{
			return await _context.Vehicles
				.Include(v => v.Color)
				.Include(v => v.Driver)
				.FirstOrDefaultAsync(v => v.Id == id);
		}

		public async Task<List<Vehicle>> GetVehiclesByDriverAsync(Guid driverId)
		{
			return await _context.Vehicles
				.Include(v => v.Color)
				.Where(v => v.IdDriver == driverId)
				.ToListAsync();
		}

		public async Task<Vehicle> CreateVehicleAsync(Vehicle vehicle)
		{
			_context.Vehicles.Add(vehicle);
			await _context.SaveChangesAsync();
			return vehicle;
		}

		public async Task<Vehicle?> UpdateVehicleAsync(Guid id, Vehicle vehicle)
		{
			var existingVehicle = await _context.Vehicles.FindAsync(id);
			if (existingVehicle == null) return null;

			_context.Entry(existingVehicle).CurrentValues.SetValues(vehicle);
			await _context.SaveChangesAsync();
			return existingVehicle;
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