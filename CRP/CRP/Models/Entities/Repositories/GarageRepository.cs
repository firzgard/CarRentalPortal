using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CRP.Models.Entities.Repositories
{
	public partial interface IGarageRepository : IRepository<Vehicle>
	{

	}

	public partial class GarageRepository : BaseRepository<Vehicle>, IGarageRepository
	{
		public GarageRepository(){ }
	}
}