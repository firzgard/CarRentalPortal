using CRP.Models.Entities.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CRP.Models.Entities.Services
{
	public interface ILocationService : IService<Location>
	{
	}

	public class LocationService : BaseService<Location>, ILocationService
	{
		public LocationService()
		{
			CRPEntities dbContext = new CRPEntities();
			this.unitOfWork = new UnitOfWork(dbContext);
			this.repository = new LocationRepository(dbContext);
		}
	}
}