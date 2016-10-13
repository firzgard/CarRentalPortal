using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using CRP.Models;
using CRP.Models.Entities;

namespace CRP.Models.ViewModels
{
	public class SearchPageViewModel
	{
		public List<Brand> BrandList { get; set; }
		public List<Category> CategoryList { get; set; }
		public List<Location> LocationList { get; set; }

		public SearchPageViewModel(List<Brand> brandList, List<Category> categoryList, List<Location> locationList)
		{
			BrandList = brandList;
			CategoryList = categoryList;
			LocationList = locationList;
		}
	}
}