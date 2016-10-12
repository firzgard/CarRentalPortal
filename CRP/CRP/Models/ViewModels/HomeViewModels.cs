using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using CRP.Models;
using CRP.Models.Entities;
using CRP.Models.Entities.Services;
using CRP.Models.Entities.Repositories;

namespace CRP.Models.ViewModels
{
	public class SearchPageViewModel
	{
		public List<Location> LocationList { get; set; }
		public List<Brand> BrandList { get; set; }
		public List<Category> CategoryList { get; set; }

		public SearchPageViewModel()
		{
			LocationService locationService = new LocationService();
			LocationList = locationService.Get().OrderBy(l => l.Name).ToList();

			BrandService brandService = new BrandService();
			BrandList = brandService.Get(
				b => b.ID != 1 // Not unlisted
				&& b.Models.Where(m => m.Vehicles.Any()).Any() // check if it has any model and vehicle
			).OrderBy(b => b.Name).ToList();

			// Reorder each brand's models by name
			foreach (Brand brand in BrandList)
			{
				brand.Models = brand.Models.OrderBy(m => m.Name).ToList();
			}

			CategoryService categoryService = new CategoryService();
			CategoryList = categoryService.Get().OrderBy(c => c.Name).ToList();
		}
	}
}