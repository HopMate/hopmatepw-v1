using System.ComponentModel.DataAnnotations;

namespace hopmate.Server.DTO
{
	public class ColorDto
	{
		public int Id { get; set; }
		public string Name { get; set; } = null!;
	}

	public class CreateColorDto
	{
		[Required]
		[StringLength(50, ErrorMessage = "The color name cannot exceed 50 characters.")]
		public string Name { get; set; } = null!;
	}

	public class UpdateColorDto
	{
		[Required]
		public int Id { get; set; }

		[Required]
		[StringLength(50, ErrorMessage = "The color name cannot exceed 50 characters.")]
		public string Name { get; set; } = null!;
	}
}
