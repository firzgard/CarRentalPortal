using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CRP.Models.Entities.Services
{
	public class ModelService
	{
	}

	public class ModelDetails
	{
		public Model Model { get; set; }
		public IQueryable<Brand> Brand { get; set; }
	}
}