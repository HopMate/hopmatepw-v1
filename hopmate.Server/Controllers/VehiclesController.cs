using hopmate.Server.DTO;
using hopmate.Server.Services;
using Microsoft.AspNetCore.Mvc;

namespace hopmate.Server.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class VehiclesController : ControllerBase
	{
		private readonly IVehicleService _vehicleService;

		public VehiclesController(IVehicleService vehicleService)
		{
			_vehicleService = vehicleService;
		}

		// GET: api/Vehicles
		[HttpGet]
		public async Task<ActionResult<IEnumerable<VehicleDTO>>> GetVehicles()
		{
			var vehicles = await _vehicleService.GetAllVehiclesAsync();
			return Ok(vehicles);
		}

		// GET: api/Vehicles/5
		[HttpGet("{id}")]
		public async Task<ActionResult<VehicleDTO>> GetVehicle(Guid id)
		{
			var vehicle = await _vehicleService.GetVehicleByIdAsync(id);

			if (vehicle == null)
			{
				return NotFound();
			}

			return Ok(vehicle);
		}

		// GET: api/Vehicles/driver/5
		[HttpGet("driver/{driverId}")]
		public async Task<ActionResult<IEnumerable<VehicleDTO>>> GetVehiclesByDriver(Guid driverId)
		{
			var vehicles = await _vehicleService.GetVehiclesByDriverIdAsync(driverId);
			return Ok(vehicles);
		}

		// POST: api/Vehicles
		[HttpPost]
		public async Task<ActionResult<VehicleDTO>> CreateVehicle(CreateVehicleDTO vehicleDto)
		{
			try
			{
				var createdVehicle = await _vehicleService.CreateVehicleAsync(vehicleDto);
				return CreatedAtAction(nameof(GetVehicle), new { id = createdVehicle.Id }, createdVehicle);
			}
			catch (InvalidOperationException ex)
			{
				return BadRequest(ex.Message);
			}
		}

		// PUT: api/Vehicles/5
		[HttpPut("{id}")]
		public async Task<IActionResult> UpdateVehicle(Guid id, UpdateVehicleDTO vehicleDto)
		{
			try
			{
				var updatedVehicle = await _vehicleService.UpdateVehicleAsync(id, vehicleDto);

				if (updatedVehicle == null)
				{
					return NotFound();
				}

				return Ok(updatedVehicle);
			}
			catch (InvalidOperationException ex)
			{
				return BadRequest(ex.Message);
			}
		}

		// DELETE: api/Vehicles/5
		[HttpDelete("{id}")]
		public async Task<IActionResult> DeleteVehicle(Guid id)
		{
			var result = await _vehicleService.DeleteVehicleAsync(id);

			if (!result)
			{
				return NotFound();
			}

			return NoContent();
		}
	}
}