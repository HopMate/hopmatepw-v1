// ColorsController.cs
using hopmate.Server.DTO;
using hopmate.Server.Services;
using Microsoft.AspNetCore.Mvc;

namespace hopmate.Server.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class ColorsController : ControllerBase
	{
		private readonly IColorService _colorService;

		public ColorsController(IColorService colorService)
		{
			_colorService = colorService;
		}

		// GET: api/Colors
		[HttpGet]
		[ProducesResponseType(StatusCodes.Status200OK)]
		public async Task<ActionResult<IEnumerable<ColorDto>>> GetColors()
		{
			var colors = await _colorService.GetAllColorsAsync();
			return Ok(colors);
		}

		// GET: api/Colors/5
		[HttpGet("{id}")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status404NotFound)]
		public async Task<ActionResult<ColorDto>> GetColor(int id)
		{
			var color = await _colorService.GetColorByIdAsync(id);

			if (color == null)
			{
				return NotFound();
			}

			return Ok(color);
		}

		// PUT: api/Colors/5
		[HttpPut("{id}")]
		[ProducesResponseType(StatusCodes.Status204NoContent)]
		[ProducesResponseType(StatusCodes.Status400BadRequest)]
		[ProducesResponseType(StatusCodes.Status404NotFound)]
		[ProducesResponseType(StatusCodes.Status409Conflict)]
		public async Task<IActionResult> PutColor(int id, UpdateColorDto colorDto)
		{
			if (id != colorDto.Id)
			{
				return BadRequest();
			}

			// Check if color with same name already exists (but different id)
			if (await _colorService.ColorNameExistsAsync(colorDto.Name) &&
				(await _colorService.GetColorByIdAsync(id))?.Name != colorDto.Name)
			{
				return Conflict("A color with this name already exists.");
			}

			var updatedColor = await _colorService.UpdateColorAsync(colorDto);
			if (updatedColor == null)
			{
				return NotFound();
			}

			return NoContent();
		}

		// POST: api/Colors
		[HttpPost]
		[ProducesResponseType(StatusCodes.Status201Created)]
		[ProducesResponseType(StatusCodes.Status409Conflict)]
		public async Task<ActionResult<ColorDto>> PostColor(CreateColorDto colorDto)
		{
			// Check if color with same name already exists
			if (await _colorService.ColorNameExistsAsync(colorDto.Name))
			{
				return Conflict("A color with this name already exists.");
			}

			var createdColor = await _colorService.CreateColorAsync(colorDto);

			return CreatedAtAction(nameof(GetColor), new { id = createdColor.Id }, createdColor);
		}

		// DELETE: api/Colors/5
		[HttpDelete("{id}")]
		[ProducesResponseType(StatusCodes.Status204NoContent)]
		[ProducesResponseType(StatusCodes.Status404NotFound)]
		public async Task<IActionResult> DeleteColor(int id)
		{
			var result = await _colorService.DeleteColorAsync(id);
			if (!result)
			{
				return NotFound();
			}

			return NoContent();
		}
	}
}