﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CRP.Models.Entities.Repositories
{
	public interface IBrandRepository : IRepository<Brand>
	{

	}

	public class BrandRepository : BaseRepository<Brand>, IBrandRepository
	{
		public BrandRepository(CRPEntities dbContext) : base(dbContext)
		{
		}
	}
}