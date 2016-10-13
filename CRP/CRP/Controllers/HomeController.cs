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
			IBrandService brandService = this.Service<IBrandService>();
			var brandList = brandService.Get(
				b => b.ID != 1 // Exclude unlisted brand
				&& b.Models.Where(m => m.Vehicles.Any()).Any() // check if it has any model and vehicle
			).OrderBy(b => b.Name).ToList();

			// Reorder each brand's models by name
			foreach (Brand brand in brandList)
			{
				brand.Models = brand.Models.OrderBy(m => m.Name).ToList();
			}

			ICategoryService categoryService = this.Service<ICategoryService>();
			var categoryList = categoryService.Get().OrderBy(c => c.Name).ToList();

			ILocationService locationService = this.Service<ILocationService>();
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
			if (searchConditions == null
					|| searchConditions.StartTime == null
					|| searchConditions.EndTime == null
					|| searchConditions.StartTime >= searchConditions.EndTime)
				return new HttpStatusCodeResult(400, "Invalid time span");

			Response.StatusCode = 200;
			Response.StatusDescription = "Queried successfully";
			SearchResultJsonModel searchResult = service.SearchVehicle(searchConditions);
			return Json(searchResult, JsonRequestBehavior.AllowGet);
		}
	}
}