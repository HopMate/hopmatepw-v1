﻿using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using hopmate.Server.Models.Auth;

namespace hopmate.Server.Models
{
	public class Passenger
	{
		[Key, ForeignKey(nameof(ApplicationUser))]
		public Guid IdUser { get; set; }

		public virtual ApplicationUser? User { get; set; }

		//public virtual ICollection<PassengerTrip> PassengerTrips { get; set; } = new List<PassengerTrip>();
		//public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();
	}
}
