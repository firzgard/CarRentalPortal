using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using CRP.Models;
using CRP.Models.Entities;
using CRP.Models.Entities.Services;
using CRP.Models.JsonModels;
using CRP.Models.ViewModels;

namespace CRP.Controllers
{
	public class HomeController : BaseController
	{

		// Route to homepage
		public ActionResult Index()
		{
			return View();
		}

		// Route to vehicle search results
		[Route("search")]
		public ActionResult Search()
		{
			var brandService = this.Service<IBrandService>();
			var brandList = brandService.Get(
				b => b.ID != 1 // Exclude unlisted brand
			).OrderBy(b => b.Name).ToList();

			// Reorder each brand's models by name
			brandList = brandList.Aggregate(new List<Brand>(), (newBrandList, b) =>
			{
				b.Models = b.Models.Aggregate(new List<Model>(), (newModelList, m) =>
				{
					if (m.Vehicles.Any())
						newModelList.Add(m);
					return newModelList;
				});

				if (b.Models.Any())
				{
					b.Models = b.Models.OrderBy(m => m.Name).ToList();
					newBrandList.Add(b);
				}

				return newBrandList;
			});

			var categoryService = this.Service<ICategoryService>();
			var categoryList = categoryService.Get().OrderBy(c => c.Name).ToList();

			var locationService = this.Service<ILocationService>();
			var locationList = locationService.Get().OrderBy(l => l.Name).ToList();

			return View(new SearchPageViewModel(brandList, categoryList, locationList));
		}

		// Route to vehicle's info
		[Route("vehicleInfo/{id:int}", Name = "VehicleInfo")]
		public ActionResult VehicleInfo(int id)
		{
			return View();
			
		}

		// API Route for guest/customer to search vehicle for booking
		// Need filtering/sorting support
		[HttpGet]
		[Route("api/search", Name = "SearchVehiclesAPI")]
		public ActionResult SearchVehiclesAPI(SearchConditionModel searchConditions)
		{
			var service = this.Service<IVehicleService>();
			if (searchConditions?.StartTime == null
				|| searchConditions.EndTime == null
				|| searchConditions.StartTime >= searchConditions.EndTime)
				return new HttpStatusCodeResult(400, "Invalid time span");

			Response.StatusCode = 200;
			Response.StatusDescription = "Queried successfully";
			var searchResult = service.SearchVehicle(searchConditions);
			return Json(searchResult, JsonRequestBehavior.AllowGet);
		}
	}
}