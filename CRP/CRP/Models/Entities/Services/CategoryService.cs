using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using CRP.Models.Entities.Repositories;

namespace CRP.Models.Entities.Services
{
	public interface ICategoryService : IService<Category>
	{
	}

	public class CategoryService : BaseService<Category>, ICategoryService
	{
		public CategoryService()
		{
			CRPEntities dbContext = new CRPEntities();
			this.unitOfWork = new UnitOfWork(dbContext);
			this.repository = new CategoryRepository(dbContext);
		}
	}
}