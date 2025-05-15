// VehiclesController.cs
using hopmate.Server.Models;
using hopmate.Server.Services;
using Microsoft.AspNetCore.Mvc;

namespace hopmate.Server.Controllers
{
	[ApiController]
	[Route("api/[controller]")]
	public class VehiclesController : ControllerBase
	{
		private readonly IVehicleService _vehicleService;

		public VehiclesController(IVehicleService vehicleService)
		{
			_vehicleService = vehicleService;
		}

		[HttpGet]
		public async Task<ActionResult<List<Vehicle>>> GetAllVehicles()
		{
			var vehicles = await _vehicleService.GetAllVehiclesAsync();
			return Ok(vehicles);
		}

		[HttpGet("{id}")]
		public async Task<ActionResult<Vehicle>> GetVehicleById(Guid id)
		{
			var vehicle = await _vehicleService.GetVehicleByIdAsync(id);
			if (vehicle == null) return NotFound();
			return Ok(vehicle);
		}

		[HttpGet("driver/{driverId}")]
		public async Task<ActionResult<List<Vehicle>>> GetVehiclesByDriver(Guid driverId)
		{
			var vehicles = await _vehicleService.GetVehiclesByDriverAsync(driverId);
			return Ok(vehicles);
		}

		[HttpPost]
		public async Task<ActionResult<Vehicle>> CreateVehicle(Vehicle vehicle)
		{
			var createdVehicle = await _vehicleService.CreateVehicleAsync(vehicle);
			return CreatedAtAction(nameof(GetVehicleById), new { id = createdVehicle.Id }, createdVehicle);
		}

		[HttpPut("{id}")]
		public async Task<ActionResult<Vehicle>> UpdateVehicle(Guid id, Vehicle vehicle)
		{
			if (id != vehicle.Id) return BadRequest();

			var updatedVehicle = await _vehicleService.UpdateVehicleAsync(id, vehicle);
			if (updatedVehicle == null) return NotFound();

			return Ok(updatedVehicle);
		}

		[HttpDelete("{id}")]
		public async Task<IActionResult> DeleteVehicle(Guid id)
		{
			var result = await _vehicleService.DeleteVehicleAsync(id);
			if (!result) return NotFound();
			return NoContent();
		}
	}
}