using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using CRP.Models;
using CRP.Models.Entities;
using CRP.Models.Entities.Services;
using CRP.Models.Entities.Repositories;
using CRP.Controllers;

namespace CRP.Models.ViewModels
{
	public class SearchPageViewModel : BaseController
	{
		public List<Location> LocationList { get; set; }
		public List<Brand> BrandList { get; set; }
		public List<Category> CategoryList { get; set; }

		public SearchPageViewModel()
		{
			var locationService = this.Service<ILocationService>();
			LocationList = locationService.Get().OrderBy(l => l.Name).ToList();

			var brandService = this.Service<IBrandService>();
			BrandList = brandService.Get(b => b.ID != 1).OrderBy(b => b.Name).ToList();
			foreach(Brand brand in BrandList)
			{
				brand.Models = brand.Models.OrderBy(m => m.Name).ToList();
			}

			var categoryService = this.Service<ICategoryService>();
			CategoryList = categoryService.Get().OrderBy(c => c.Name).ToList();
		}
	}
}