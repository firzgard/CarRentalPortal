using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CRP.Models.Entities.Repositories
{
	public partial interface IVehicleRepository : IRepository<Vehicle>
	{

	}

	public partial class VehicleRepository : BaseRepository<Vehicle>, IVehicleRepository
	{
		public VehicleRepository(){ }
	}
}