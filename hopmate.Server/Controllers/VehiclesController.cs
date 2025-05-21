using hopmate.Server.DTO;
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
		public async Task<IActionResult> GetAll()
		{
			var vehicles = await _vehicleService.GetAllVehiclesAsync();
			return Ok(vehicles);
		}

		[HttpGet("{id}")]
		public async Task<IActionResult> GetById(Guid id)
		{
			var vehicle = await _vehicleService.GetVehicleByIdAsync(id);
			if (vehicle == null) return NotFound();
			return Ok(vehicle);
		}

		[HttpPost]
		public async Task<IActionResult> Create([FromBody] CreateVehicleDTO dto)
		{
			var created = await _vehicleService.CreateVehicleAsync(dto);
			return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
		}

		[HttpPut("{id}")]
		public async Task<IActionResult> Update(Guid id, [FromBody] UpdateVehicleDTO dto)
		{
			var updated = await _vehicleService.UpdateVehicleAsync(id, dto);
			if (updated == null) return NotFound();
			return Ok(updated);
		}

		[HttpDelete("{id}")]
		public async Task<IActionResult> Delete(Guid id)
		{
			var deleted = await _vehicleService.DeleteVehicleAsync(id);
			return deleted ? NoContent() : NotFound();
		}
	}
}