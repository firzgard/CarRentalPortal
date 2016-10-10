using CRP.Models.Entities.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CRP.Models.Entities.Services
{
	public interface IBrandService : IService<Brand>
	{
	}

	public class BrandService : BaseService<Brand>, IBrandService
	{
		public BrandService()
		{
			CRPEntities dbContext = new CRPEntities();
			this.unitOfWork = new UnitOfWork(dbContext);
			this.repository = new BrandRepository(dbContext);
		}
	}
}